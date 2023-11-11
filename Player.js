import {
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
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
import React, { useEffect, useRef, useState } from "react";
import { TopSongs } from "./listOfSongs";
import Slider from "@react-native-community/slider";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const setUpPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        // Capability.Stop,
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
  const songSlider = useRef(null);

  const [songIndex, setSongIndex] = useState(0);
  const [songTitle, setSongTitle] = useState();
  const [songArtist, setSongArtist] = useState();
  const [songImage, setSongImage] = useState();
  const [songArtwork, setSongArtwork] = useState();
  const [repeatMode, setRepeatMode] = useState("off");
  // const [isSongChange, setIsSongChange] = useState(false);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artist, imageUrl, artwork } = track;
      setSongArtist(artist);
      setSongImage(imageUrl);
      setSongTitle(title);
      setSongArtwork(artwork);
      // isSongChange(true);
    }
  });

  const skipTo = async (trackId) => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    setUpPlayer();

    scrollX.addListener(({ value }) => {
      // console.log(`ScrollX : ${value} | Device width: ${width}`);

      const index = Math.round(value / width);
      setSongIndex(index);
      skipTo(index);
      console.log(index);
    });

    // setIsSongChange(false);

    return () => {
      TrackPlayer.reset();
      scrollX.removeAllListeners();
    };
  }, []);

  const scrollX = useRef(new Animated.Value(0)).current;

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrev = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const repeatIconToggle = () => {
    if (repeatMode === "off") {
      return "repeat-off";
    }
    if (repeatMode === "track") {
      return "repeat";
    }
    if (repeatMode === "song") {
      return "repeat-once";
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode === "off") {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode("song");
    }
    if (repeatMode === "track") {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode("off");
    }
    if (repeatMode === "song") {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode("track");
    }
  };

  const renderSongs = ({ item, index }) => {
    return (
      <Animated.View style={styles.parentImageWrapper}>
        <View style={styles.imageWrapper}>
          <Image source={songImage} style={styles.musicImage} />
        </View>
      </Animated.View>
    );
  };
  return (
    <SafeAreaView>
      <View style={{ alignItems: "center" }}>
        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSongs}
          data={TopSongs}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x: scrollX },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={{ flexGrow: 0 }}
        />

        <View>
          <Text style={styles.title}>{songTitle}</Text>
          <Text style={styles.artist}>{songArtist}</Text>
        </View>

        <View>
          <Slider
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="blue"
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
          <TouchableOpacity onPress={skipToPrev}>
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
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons name="play-skip-forward-outline" size={35} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={changeRepeatMode}>
          <MaterialCommunityIcons
            name={`${repeatIconToggle()}`}
            size={30}
            color={repeatMode !== "off" ? "blue" : "black"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Player;

const styles = StyleSheet.create({
  imageWrapper: {
    width: 300,
    height: 340,
    // borderColor: "red",
    // borderWidth: 2,
    // marginBottom: 25,
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
  parentImageWrapper: {
    width: width,
    // height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
});
