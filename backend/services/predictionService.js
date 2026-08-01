import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const predictionScript = join(currentDirectory, '..', 'python', 'predict.py');
const projectRoot = join(currentDirectory, '..', '..');

function resolvePythonCommand() {
  if (env.pythonCommand) return env.pythonCommand;
  const candidates = process.platform === 'win32'
    ? [join(projectRoot, '.venv', 'Scripts', 'python.exe')]
    : [join(projectRoot, '.venv', 'bin', 'python')];
  return candidates.find(existsSync) || (process.platform === 'win32' ? 'python' : 'python3');
}

function fallbackPrediction(input) {
  const weatherRisk = { Clear: 0, Cloudy: 6, Rain: 20, Fog: 27, Storm: 38 }[input.weather];
  const peakRisk = input.departureHour >= 16 && input.departureHour <= 20 ? 18 : input.departureHour >= 8 && input.departureHour <= 11 ? 9 : 0;
  const monsoonRisk = input.month >= 6 && input.month <= 9 ? 8 : 0;
  const distanceRisk = Math.min(10, input.distance / 1000 * 2);
  const probability = Math.min(94, Math.max(6, Math.round(12 + weatherRisk + peakRisk + monsoonRisk + distanceRisk)));
  return {
    prediction: probability >= 50 ? 'Likely delayed' : 'Likely on time',
    probability,
    expectedDelayMinutes: Math.max(3, Math.round(probability * 0.48)),
    modelVersion: 'heuristic-preview',
    fallback: true,
  };
}

function executePython(input) {
  return new Promise((resolve, reject) => {
    const child = spawn(resolvePythonCommand(), [predictionScript], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    let stdout = '';
    let stderr = '';
    const timeout = setTimeout(() => {
      child.kill();
      reject(new ApiError(504, 'Prediction process timed out'));
    }, env.predictionTimeoutMs);

    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => { clearTimeout(timeout); reject(error); });
    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0) return reject(new Error(stderr || `Prediction process exited with code ${code}`));
      try { resolve(JSON.parse(stdout)); } catch { reject(new Error('Prediction process returned invalid JSON')); }
    });
    child.stdin.end(JSON.stringify(input));
  });
}

export async function predictDelay(input) {
  if (existsSync(predictionScript)) {
    try { return await executePython(input); }
    catch (error) {
      if (!env.allowPredictionFallback) throw new ApiError(503, 'ML prediction service is unavailable', error.message);
    }
  }
  if (!env.allowPredictionFallback) throw new ApiError(503, 'ML model has not been installed');
  return fallbackPrediction(input);
}
