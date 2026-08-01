"""Train and evaluate FlightIQ's delay classification and regression models."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from preprocessing import MODEL_FEATURES, build_preprocessor


def train(dataset_path: Path, artifact_dir: Path) -> dict:
    frame = pd.read_csv(dataset_path)
    missing = set(MODEL_FEATURES + ["delay_minutes", "delayed"]) - set(frame.columns)
    if missing:
        raise ValueError(f"Dataset is missing columns: {', '.join(sorted(missing))}")

    x = frame[MODEL_FEATURES]
    y_class = frame["delayed"].astype(int)
    y_delay = frame["delay_minutes"].astype(float)
    indices = np.arange(len(frame))
    train_indices, test_indices = train_test_split(indices, test_size=0.2, random_state=42, stratify=y_class)

    classifier = Pipeline(steps=[
        ("preprocessor", build_preprocessor()),
        ("model", RandomForestClassifier(
            n_estimators=120, max_depth=12, min_samples_leaf=4,
            class_weight="balanced", random_state=42, n_jobs=-1,
        )),
    ])
    regressor = Pipeline(steps=[
        ("preprocessor", build_preprocessor()),
        ("model", RandomForestRegressor(
            n_estimators=90, max_depth=12, min_samples_leaf=4,
            random_state=42, n_jobs=-1,
        )),
    ])

    classifier.fit(x.iloc[train_indices], y_class.iloc[train_indices])
    regressor.fit(x.iloc[train_indices], y_delay.iloc[train_indices])
    predicted = classifier.predict(x.iloc[test_indices])
    predicted_delay = regressor.predict(x.iloc[test_indices])
    matrix = confusion_matrix(y_class.iloc[test_indices], predicted).tolist()

    feature_names = classifier.named_steps["preprocessor"].get_feature_names_out()
    importance_values = classifier.named_steps["model"].feature_importances_
    raw_importance = dict(zip(feature_names, importance_values, strict=True))
    grouped = {}
    for feature in MODEL_FEATURES:
        grouped[feature] = sum(value for name, value in raw_importance.items() if name == feature or name.startswith(f"{feature}_"))
    grouped = dict(sorted(grouped.items(), key=lambda item: item[1], reverse=True))

    version = datetime.now(timezone.utc).strftime("rf-%Y%m%d-%H%M%S")
    metrics = {
        "version": version,
        "algorithm": "Random Forest Classifier + Regressor",
        "accuracy": round(accuracy_score(y_class.iloc[test_indices], predicted), 4),
        "precision": round(precision_score(y_class.iloc[test_indices], predicted, zero_division=0), 4),
        "recall": round(recall_score(y_class.iloc[test_indices], predicted, zero_division=0), 4),
        "f1Score": round(f1_score(y_class.iloc[test_indices], predicted, zero_division=0), 4),
        "meanAbsoluteErrorMinutes": round(mean_absolute_error(y_delay.iloc[test_indices], predicted_delay), 2),
        "confusionMatrix": matrix,
        "featureImportance": [{"feature": key, "value": round(value, 6)} for key, value in grouped.items()],
        "trainingRows": int(len(train_indices)),
        "testRows": int(len(test_indices)),
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "dataset": dataset_path.name,
        "datasetType": "deterministic synthetic demonstration data",
        "scikitLearnVersion": sklearn.__version__,
    }

    artifact_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump({"classifier": classifier, "regressor": regressor, "version": version}, artifact_dir / "model.joblib")
    (artifact_dir / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, required=True)
    parser.add_argument("--artifacts", type=Path, required=True)
    args = parser.parse_args()
    metrics = train(args.dataset, args.artifacts)
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
