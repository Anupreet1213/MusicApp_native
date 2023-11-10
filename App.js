import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
// import TrackPlayer from "react-native-track-player";
import Player from "./Player";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Player />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: "grey",
    // justifyContent: "center",
  },
});
