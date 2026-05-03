import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

const teams = [
  "Mumbai Indians",
  "Chennai Super Kings",
  "Royal Challengers Bengaluru",
  "Kolkata Knight Riders",
  "Delhi Capitals",
  "Rajasthan Royals",
  "Punjab Kings",
  "Sunrisers Hyderabad",
  "Lucknow Super Giants",
  "Gujarat Titans",
];

export default function HomeScreen() {
  const [team1, setTeam1] = useState(teams[0]);
  const [team2, setTeam2] = useState(teams[1]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictMatch = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("https://ipl-predictor-te7x.onrender.com/predict_match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team1: team1,
          team2: team2,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Error connecting to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>🏏 IPL Predictor</Text>

      {/* Team 1 */}
      <Text style={styles.label}>Team 1</Text>
      <Picker
        selectedValue={team1}
        onValueChange={(itemValue) => setTeam1(itemValue)}
        style={styles.picker}
      >
        {teams.map((team) => (
          <Picker.Item key={team} label={team} value={team} />
        ))}
      </Picker>

      {/* Team 2 */}
      <Text style={styles.label}>Team 2</Text>
      <Picker
        selectedValue={team2}
        onValueChange={(itemValue) => setTeam2(itemValue)}
        style={styles.picker}
      >
        {teams.map((team) => (
          <Picker.Item key={team} label={team} value={team} />
        ))}
      </Picker>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={predictMatch}>
        <Text style={styles.buttonText}>PREDICT MATCH</Text>
      </TouchableOpacity>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#00ffcc" />}

      {/* Result Card */}
      {result && (
        <View style={styles.card}>
          <Text style={styles.resultTitle}>🏆 Prediction Result</Text>

          <Text style={styles.resultText}>
            {result.team1}: {result.team1_win_prob}%
          </Text>

          <Text style={styles.resultText}>
            {result.team2}: {result.team2_win_prob}%
          </Text>

          <Text style={styles.winner}>
            Winner: {result.predicted_winner}
          </Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#38bdf8",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#cbd5f5",
    marginTop: 10,
  },
  picker: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#38bdf8",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  resultTitle: {
    color: "#22c55e",
    fontSize: 20,
    marginBottom: 10,
  },
  resultText: {
    color: "white",
    fontSize: 16,
  },
  winner: {
    color: "#facc15",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
});