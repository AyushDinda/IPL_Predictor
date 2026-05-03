from flask import Flask, request, jsonify
import json
import random
import os

app = Flask(__name__)

# Load model output
with open("results.json") as f:
    data = json.load(f)

total = sum(data.values())
team_strength = {k: v/total for k, v in data.items()}

# Home route
@app.route("/")
def home():
    return "IPL API Running"

# Get all probabilities
@app.route("/probabilities")
def probabilities():
    probs = {k: round(v * 100, 2) for k, v in team_strength.items()}
    return jsonify(probs)

# Match prediction
@app.route("/predict_match", methods=["POST"])
def predict_match():
    req = request.json

    team1 = req["team1"]
    team2 = req["team2"]

    p1 = team_strength.get(team1, 0.5)
    p2 = team_strength.get(team2, 0.5)

    total = p1 + p2
    p1 /= total
    p2 /= total

    winner = team1 if random.random() < p1 else team2

    return jsonify({
        "team1": team1,
        "team2": team2,
        "team1_win_prob": round(p1 * 100, 2),
        "team2_win_prob": round(p2 * 100, 2),
        "predicted_winner": winner
    })

# IMPORTANT: Render-compatible run
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))