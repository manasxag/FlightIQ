"""One-command reproducible dataset generation and model training."""

from __future__ import annotations

from pathlib import Path

from generate_dataset import generate
from train import train

ROOT = Path(__file__).resolve().parents[2]
DATASET = ROOT / "dataset" / "flights_demo.csv"
ARTIFACTS = Path(__file__).resolve().parent / "artifacts"

DATASET.parent.mkdir(parents=True, exist_ok=True)
generate(15_000, 42).to_csv(DATASET, index=False)
metrics = train(DATASET, ARTIFACTS)
print(f"FlightIQ model {metrics['version']} trained with {metrics['accuracy']:.1%} accuracy")
