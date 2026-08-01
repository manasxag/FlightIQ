import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Binary, BrainCircuit, Database, GitBranch, ScanSearch } from 'lucide-react';
import { featureImportance } from '../data/mockData';
import { fetchModelInsights } from '../services/api';

const tooltipStyle = { background: '#101d2d', border: '1px solid #25364b', borderRadius: 10, color: '#e7f0f8', fontSize: 12 };

export default function ModelInsights() {
  const [metrics, setMetrics] = useState({
    version: 'rf-20260729', algorithm: 'Random Forest Classifier + Regressor',
    accuracy: 0.8493, precision: 0.8279, recall: 0.7709, f1Score: 0.7984,
    meanAbsoluteErrorMinutes: 5.22, confusionMatrix: [[1653, 186], [266, 895]],
    featureImportance, trainingRows: 12000, testRows: 3000,
  });
  useEffect(() => { fetchModelInsights().then(setMetrics).catch(() => {}); }, []);
  const importance = metrics.featureImportance.map((item) => ({ ...item, feature: item.feature.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase()) }));
  const percent = (value) => `${(value * 100).toFixed(1)}%`;
  const [[trueNegative, falsePositive], [falseNegative, truePositive]] = metrics.confusionMatrix;
  return (
    <>
      <section className="model-hero panel"><div className="model-orbit"><span><BrainCircuit size={36} /></span><i /><i /></div><div><p className="eyebrow"><Binary size={14}/> Machine learning engine</p><h2>{metrics.algorithm}</h2><p>Two reproducible Random Forest models classify disruption risk and estimate expected delay minutes from eight operational features.</p><div className="model-tags"><span>scikit-learn</span><span>{metrics.trainingRows.toLocaleString()} training rows</span><span>8 features</span><span>{metrics.version}</span></div></div></section>
      <div className="model-metrics"><article><span>Accuracy</span><strong>{percent(metrics.accuracy)}</strong><i style={{ width: percent(metrics.accuracy) }}/></article><article><span>Precision</span><strong>{percent(metrics.precision)}</strong><i style={{ width: percent(metrics.precision) }}/></article><article><span>Recall</span><strong>{percent(metrics.recall)}</strong><i style={{ width: percent(metrics.recall) }}/></article><article><span>F1 score</span><strong>{percent(metrics.f1Score)}</strong><i style={{ width: percent(metrics.f1Score) }}/></article></div>
      <div className="insights-grid">
        <section className="panel feature-panel"><div className="panel-heading"><div><h2>Feature importance</h2><p>Relative influence on the model’s decisions</p></div></div><ResponsiveContainer width="100%" height={320}><BarChart data={importance} layout="vertical" margin={{ left: 15, right: 20 }}><CartesianGrid stroke="#1e2c3e" horizontal={false}/><XAxis type="number" tickFormatter={(v) => `${v * 100}%`} stroke="#6f8198" axisLine={false} tickLine={false}/><YAxis type="category" dataKey="feature" width={100} stroke="#8fa1b7" axisLine={false} tickLine={false} fontSize={11}/><Tooltip contentStyle={tooltipStyle} formatter={(v) => `${Math.round(v * 100)}%`}/><Bar dataKey="value" fill="#24c7d9" radius={[0,5,5,0]} barSize={17}/></BarChart></ResponsiveContainer></section>
        <section className="panel matrix-panel"><div className="panel-heading"><div><h2>Confusion matrix</h2><p>{metrics.testRows.toLocaleString()} unseen test records</p></div></div><div className="matrix-label top">Predicted outcome</div><div className="matrix-wrap"><div className="matrix-label side">Actual outcome</div><div className="matrix"><div className="matrix-axis"><span>On time</span><span>Delayed</span></div><div className="matrix-row"><b>On time</b><div className="correct"><strong>{trueNegative.toLocaleString()}</strong><span>True negative</span></div><div><strong>{falsePositive.toLocaleString()}</strong><span>False positive</span></div></div><div className="matrix-row"><b>Delayed</b><div><strong>{falseNegative.toLocaleString()}</strong><span>False negative</span></div><div className="correct"><strong>{truePositive.toLocaleString()}</strong><span>True positive</span></div></div></div></div></section>
      </div>
      <section className="panel pipeline-panel"><div className="panel-heading"><div><h2>How a prediction is made</h2><p>From raw inputs to an explainable result in four steps · delay MAE {metrics.meanAbsoluteErrorMinutes} min</p></div></div><div className="pipeline"><div><span><Database size={20}/></span><strong>Collect</strong><p>Route, schedule, carrier and weather inputs</p></div><i/><div><span><ScanSearch size={20}/></span><strong>Prepare</strong><p>Impute, encode and normalize eight features</p></div><i/><div><span><GitBranch size={20}/></span><strong>Evaluate</strong><p>Independent trees assess delay likelihood</p></div><i/><div><span><BrainCircuit size={20}/></span><strong>Predict</strong><p>Votes combine into probability and delay estimate</p></div></div></section>
    </>
  );
}
