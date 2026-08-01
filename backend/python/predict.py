"""Read one JSON flight from stdin and return a model prediction as JSON."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import joblib
import pandas as pd

from preprocessing import MODEL_FEATURES


def main() -> None:
    artifact_path = Path(__file__).resolve().parent / "artifacts" / "model.joblib"
    if not artifact_path.exists():
        raise FileNotFoundError("Model artifact is missing. Run train.py first.")
    raw = json.load(sys.stdin)
    row = {
        "airline": raw["airline"], "origin": raw["origin"], "destination": raw["destination"],
        "departure_hour": int(raw["departureHour"]), "month": int(raw["month"]),
        "day_of_week": raw["dayOfWeek"], "distance": float(raw["distance"]), "weather": raw["weather"],
    }
    frame = pd.DataFrame([row], columns=MODEL_FEATURES)
    artifact = joblib.load(artifact_path)
    probability = float(artifact["classifier"].predict_proba(frame)[0][1])
    expected_delay = max(0, round(float(artifact["regressor"].predict(frame)[0])))
    print(json.dumps({
        "prediction": "Likely delayed" if probability >= 0.5 else "Likely on time",
        "probability": round(probability * 100),
        "expectedDelayMinutes": expected_delay,
        "modelVersion": artifact["version"],
        "fallback": False,
    }))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # return a clean process error for the Node bridge
        print(str(error), file=sys.stderr)
        raise SystemExit(1) from error
