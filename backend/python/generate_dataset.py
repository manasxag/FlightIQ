"""Generate a deterministic, realistic demonstration dataset for FlightIQ."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd

AIRLINES = np.array(["AI", "6E", "UK", "SG", "QP"])
AIRLINE_RISK = {"AI": 7, "6E": 1, "UK": -3, "SG": 10, "QP": 4}
AIRPORTS = np.array(["DEL", "BOM", "BLR", "HYD", "MAA", "CCU"])
AIRPORT_RISK = {"DEL": 8, "BOM": 7, "BLR": 3, "HYD": 0, "MAA": 1, "CCU": 5}
DAYS = np.array(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
WEATHERS = np.array(["Clear", "Cloudy", "Rain", "Fog", "Storm"])
WEATHER_PROBABILITIES = np.array([0.55, 0.20, 0.15, 0.07, 0.03])
WEATHER_RISK = {"Clear": -5, "Cloudy": 2, "Rain": 17, "Fog": 24, "Storm": 38}


def generate(rows: int, seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    airline = rng.choice(AIRLINES, rows)
    origin = rng.choice(AIRPORTS, rows)
    destination = rng.choice(AIRPORTS, rows)
    identical = origin == destination
    while identical.any():
        destination[identical] = rng.choice(AIRPORTS, identical.sum())
        identical = origin == destination

    departure_hour = rng.integers(0, 24, rows)
    month = rng.integers(1, 13, rows)
    day_of_week = rng.choice(DAYS, rows)
    weather = rng.choice(WEATHERS, rows, p=WEATHER_PROBABILITIES)
    route_base = rng.integers(450, 1850, rows)
    distance = np.clip(route_base + rng.normal(0, 90, rows), 280, 2400).round().astype(int)

    peak = np.where((departure_hour >= 16) & (departure_hour <= 20), 13, 0)
    morning = np.where((departure_hour >= 8) & (departure_hour <= 10), 6, 0)
    monsoon = np.where((month >= 6) & (month <= 9), 7, 0)
    weekend = np.where(np.isin(day_of_week, ["Friday", "Sunday"]), 4, 0)
    airline_component = np.vectorize(AIRLINE_RISK.get)(airline)
    airport_component = np.vectorize(AIRPORT_RISK.get)(origin)
    weather_component = np.vectorize(WEATHER_RISK.get)(weather)
    noise = rng.normal(0, 7.5, rows)
    raw_delay = -8 + peak + morning + monsoon + weekend + airline_component + airport_component + weather_component + distance / 600 + noise
    delay_minutes = np.clip(np.round(raw_delay), 0, 180).astype(int)

    missing_weather = rng.random(rows) < 0.012
    weather = weather.astype(object)
    weather[missing_weather] = None

    return pd.DataFrame({
        "airline": airline,
        "origin": origin,
        "destination": destination,
        "departure_hour": departure_hour,
        "month": month,
        "day_of_week": day_of_week,
        "distance": distance,
        "weather": weather,
        "delay_minutes": delay_minutes,
        "delayed": (delay_minutes >= 15).astype(int),
    })


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=15_000)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    frame = generate(args.rows, args.seed)
    frame.to_csv(args.output, index=False)
    print(f"Generated {len(frame):,} rows at {args.output}")


if __name__ == "__main__":
    main()
