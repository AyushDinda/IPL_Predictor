import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const teams = [
  "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bengaluru",
  "Kolkata Knight Riders", "Delhi Capitals", "Rajasthan Royals",
  "Punjab Kings", "Sunrisers Hyderabad", "Lucknow Super Giants", "Gujarat Titans",
];

const teamColors: { [key: string]: string } = {
  "Mumbai Indians": "#004BA0", "Chennai Super Kings": "#FDB913",
  "Royal Challengers Bengaluru": "#2B2A29", "Kolkata Knight Riders": "#3A225D",
  "Delhi Capitals": "#00008B", "Rajasthan Royals": "#EA1A85",
  "Punjab Kings": "#DD1F2D", "Sunrisers Hyderabad": "#FF822A",
  "Lucknow Super Giants": "#0057E2", "Gujarat Titans": "#1B2133",
};

export default function AdvancedHomeScreen() {
  const [team1, setTeam1] = useState(teams[0]);
  const [team2, setTeam2] = useState(teams[1]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingFor, setSelectingFor] = useState<1 | 2>(1);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const openSelector = (teamNum: 1 | 2) => {
    setSelectingFor(teamNum);
    setModalVisible(true);
  };

  const selectTeam = (team: string) => {
    if (selectingFor === 1) setTeam1(team);
    else setTeam2(team);
    setModalVisible(false);
  };

  const predictMatch = async () => {
    if (team1 === team2) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("https://ipl-predictor-te7x.onrender.com/predict_match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team1, team2 }),
      });
      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>PREMIER LEAGUE 2026</Text>
          <Text style={styles.headerTitle}>MATCH PREDICTOR</Text>
        </View>

        {/* VS Section */}
        <View style={styles.vsContainer}>
          <TeamCard team={team1} label="HOME" onPress={() => openSelector(1)} />
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <TeamCard team={team2} label="AWAY" onPress={() => openSelector(2)} />
        </View>

        {/* Prediction Button */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={[styles.predictBtn, team1 === team2 && styles.disabledBtn]} 
          onPress={predictMatch}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.predictBtnText}>ANALYZE MATCHUP</Text>}
        </TouchableOpacity>

        {/* Result Area */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.probabilityTitle}>WIN PROBABILITY</Text>
            
            <View style={styles.barContainer}>
               <View style={[styles.bar, { width: `${result.team1_win_prob}%`, backgroundColor: teamColors[team1] || '#38bdf8' }]} />
               <View style={[styles.bar, { width: `${result.team2_win_prob}%`, backgroundColor: teamColors[team2] || '#facc15' }]} />
            </View>

            <View style={styles.probLabelRow}>
               <Text style={styles.probValue}>{result.team1_win_prob}%</Text>
               <Text style={styles.probValue}>{result.team2_win_prob}%</Text>
            </View>

            <View style={styles.winnerCard}>
               <Text style={styles.winnerSub}>PROJECTED WINNER</Text>
               <Text style={styles.winnerName}>{result.predicted_winner}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Team Selection Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Team</Text>
            <FlatList
              data={teams}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.teamItem} onPress={() => selectTeam(item)}>
                  <View style={[styles.colorDot, { backgroundColor: teamColors[item] }]} />
                  <Text style={styles.teamItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const TeamCard = ({ team, label, onPress }: any) => (
  <TouchableOpacity style={styles.teamCard} onPress={onPress}>
    <Text style={styles.cardLabel}>{label}</Text>
    <View style={[styles.teamLogoPlaceholder, { borderColor: teamColors[team] }]}>
        <Text style={styles.teamInitial}>{team.charAt(0)}</Text>
    </View>
    <Text style={styles.teamNameText} numberOfLines={1}>{team}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05080d" },
  scrollContent: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  headerSubtitle: { color: '#38bdf8', letterSpacing: 4, fontSize: 12, fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '900' },
  
  vsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  teamCard: { width: width * 0.35, alignItems: 'center', backgroundColor: '#111827', padding: 15, borderRadius: 24, borderWidth: 1, borderColor: '#1f2937' },
  cardLabel: { color: '#6b7280', fontSize: 10, fontWeight: 'bold', marginBottom: 10 },
  teamLogoPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: 10 },
  teamInitial: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  teamNameText: { color: '#fff', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  
  vsBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', zIndex: 1, shadowColor: '#38bdf8', shadowOpacity: 0.5, shadowRadius: 10 },
  vsText: { color: '#000', fontWeight: '900', fontSize: 14 },

  predictBtn: { backgroundColor: '#38bdf8', padding: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#38bdf8', shadowOpacity: 0.4, shadowRadius: 15, elevation: 8 },
  disabledBtn: { backgroundColor: '#1f2937', shadowOpacity: 0 },
  predictBtnText: { color: '#000', fontWeight: '900', letterSpacing: 1 },

  resultContainer: { marginTop: 40, backgroundColor: '#111827', padding: 20, borderRadius: 24 },
  probabilityTitle: { color: '#94a3b8', textAlign: 'center', fontSize: 12, fontWeight: 'bold', marginBottom: 15 },
  barContainer: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', backgroundColor: '#1f2937' },
  bar: { height: '100%' },
  probLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  probValue: { color: '#fff', fontWeight: 'bold' },

  winnerCard: { marginTop: 30, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1f2937', paddingTop: 20 },
  winnerSub: { color: '#22c55e', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  winnerName: { color: '#facc15', fontSize: 22, fontWeight: '900', marginTop: 5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#111827', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  teamItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1f2937' },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  teamItemText: { color: '#cbd5e1', fontSize: 16 },
  closeBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  closeBtnText: { color: '#ef4444', fontWeight: 'bold' }
});