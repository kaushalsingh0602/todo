import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";

type Props = {
  total: number;
  done: number;
  sortBy: "recent" | "id";
  onToggleSort: () => void;
  filter: "all" | "active" | "done";
  setFilter: (f: "all" | "active" | "done") => void;
  onAdd: () => void;
  loading?: boolean;
};

export default function HeaderControls({
  total,
  done,
  sortBy,
  onToggleSort,
  filter,
  setFilter,
  onAdd,
  loading = false,
}: Props) {
  return (
    <LinearGradient
      colors={["#1E3A8A", "#2563EB", "#3B82F6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>Total: {total} | Done: {done} 🎯</Text>

      <View style={styles.row}>
        <View style={styles.leftRow}>
          <TouchableOpacity style={styles.sortBtn} onPress={onToggleSort} activeOpacity={0.8}>
            <Text style={styles.sortText} numberOfLines={1} ellipsizeMode="tail">
              Sort: {sortBy === "recent" ? "Recent" : "ID"}
            </Text>
          </TouchableOpacity>

          {["all", "active", "done"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item as any)}
              style={[
                styles.filterCircle,
                filter === item && styles.filterCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.filterTextActive,
                ]}
              >
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.plus}>+</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#374151",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    // flex: 1, // Take remaining space
    flexWrap: "wrap",
  },
  sortBtn: {
    paddingVertical: 8,
    paddingHorizontal: 7,
    backgroundColor: "rgba(71,85,105,0.8)",
    borderRadius: 12,
    marginRight: 10,
    maxWidth: 120, // prevent text from growing too much
  },
  sortText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  filterCircle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(30,41,59,0.8)",
    marginRight: 10,
  },
  filterCircleActive: {
    backgroundColor: "#22C55E",
  },
  filterText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 13,
  },
  filterTextActive: {
    color: "#000",
    fontWeight: "700",
  },

  addBtn: {
    backgroundColor: "#FACC15",
    height: 42,
    width: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  plus: { fontSize: 28, fontWeight: "bold", color: "#000" },
});
