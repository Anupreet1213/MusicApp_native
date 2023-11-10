import {
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import React, { useEffect } from "react";
import { TopSongs } from "./listOfSongs";
import Slider from "@react-native-community/slider";
import Ionicons from "react-native-vector-icons/Ionicons";

const setUpPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });
    await TrackPlayer.add(TopSongs);
    // await TrackPlayer.play();
    // console.log("Hii");
  } catch (error) {
    console.log(error);
  }
};

const togglePlayback = async (playbackState) => {
  const currTrack = await TrackPlayer.getActiveTrack();
  // const state = `{ "state": "paused" }`;
  console.log(playbackState.state);
  if (currTrack != null) {
    if (
      (playbackState.state == State.Ready) |
      (playbackState.state == State.Paused)
    ) {
      await TrackPlayer.play();
      console.log("play");
    } else {
      await TrackPlayer.pause();
      console.log("pause");
    }
  }
};

// const skipToNext = () =>{

// }

const Player = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    setUpPlayer();

    // return TrackPlayer.reset();
  }, []);
  return (
    <SafeAreaView>
      <View style={{ alignItems: "center" }}>
        <View style={styles.imageWrapper}>
          <Image
            source={require("./assets/favicon.png")}
            style={styles.musicImage}
          />
        </View>
        <View>
          <Text style={styles.title}>Some Title</Text>
          <Text style={styles.artist}>Some artist</Text>
        </View>

        <View>
          <Slider
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#ffd369"
            onSlidingComplete={async (value) => {
              await TrackPlayer.seekTo(value);
            }}
          />
          <View style={styles.progressDurationWrapper}>
            <Text style={styles.progressDuration}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(4)}
            </Text>
            <Text style={styles.progressDuration}>
              {new Date(progress.duration * 1000)
                .toLocaleTimeString()
                .substring(4)}
            </Text>
          </View>
        </View>

        <View style={styles.controlsWrapper}>
          <TouchableOpacity>
            <Ionicons name="play-skip-back-outline" size={35} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayback(playbackState)}>
            <Ionicons
              name={
                playbackState.state === State.Playing
                  ? "ios-pause-circle"
                  : "ios-play-circle"
              }
              size={55}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="play-skip-forward-outline" size={35} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Player;

const styles = StyleSheet.create({
  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
  },
  musicImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#eeeeee",
  },
  artist: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    color: "#eeeeee",
  },
  progressBar: {
    width: 300,
    height: 40,
    marginTop: 25,
    flexDirection: "row",
  },
  progressDurationWrapper: {
    width: 300,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressDuration: {
    color: "#fff",
    fontWeight: "500",
  },
  controlsWrapper: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 30,
    width: 250,
  },
});
