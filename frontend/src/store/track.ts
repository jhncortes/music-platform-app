import { defineStore } from "pinia";
import axiosClient from "../axios";
import { ref, computed } from "vue";
import type { Track } from "../types/Track";
import { useCommentStore } from "./comment";

export const useTrackStore = defineStore("track", () => {
  // Fetched tracks
  const tracks = ref<Track[]>([]);
  const currentTrack = ref<Track | null>(null);
  const viewedTrack = ref<Track | null>(null);

  // Player state
  //const currentIndex = ref<number>(0);
  const isPlaying = ref(false);
  const audio = ref<HTMLAudioElement | null>(null);
  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();

  // Computed property to get track duration
  const duration = ref(0);
  const currentTime = ref(0);
  const progress = ref(0); // 0–1
  const volume = ref(1); // 0–1

  //audio.crossOrigin = "anonymous";

  //const currentTrack = computed(() => tracks.value[currentIndex.value] || null);

  function setCurrentTrack(track: Track) {
    // Allow toggling play/pause on the same track
    if (currentTrack.value?.id === track.id) {
      togglePlay();
      return;
    }
    // If switching tracks, pause current audio
    if (audio.value && currentTrack.value?.id !== track.id) {
      audio.value.pause();
    }

    currentTime.value = 0;
    progress.value = 0;
    duration.value = 0;
    isPlaying.value = false;

    // Switch to new track and reset state
    currentTrack.value = track;

    // Always create a new Audio element for the new track
    audio.value = new Audio(track.audioUrl);
    audio.value.crossOrigin = "anonymous";

    const sourceNode = audioContext.createMediaElementSource(audio.value);
    sourceNode.connect(gainNode).connect(audioContext.destination);

    audio.value.addEventListener("ended", () => {
      isPlaying.value = false;
    });

    audio.value.addEventListener("timeupdate", () => {
      currentTime.value = audio.value!.currentTime;
      progress.value = audio.value!.currentTime / audio.value!.duration;
    });

    audio.value.addEventListener("loadedmetadata", () => {
      //progress.value = 0;
      duration.value = audio.value!.duration;
    });

    // Force play the new track
    console.log("Playing new track:", track.title);
    playAudio();
  }

  // Fetch tracks for a user
  async function fetchTracks(userId: number | null) {
    try {
      const { data } = await axiosClient.get(`/api/tracks?userId=${userId}`);
      tracks.value = data;
      console.log("Tracks fetched:", data);
      return data;
    } catch (error) {
      console.error("Error fetching tracks:", error);
      throw error;
    }
  }

  async function fetchTrackbyId(trackId: string | null) {
    try {
      const { data } = await axiosClient.get(`/api/tracks/${trackId}`);
      const commentStore = useCommentStore();
      viewedTrack.value = data;
      commentStore.comments = data.comments;
      console.log("Viewed track fetched:", data);
      return data;
    } catch (error) {
      console.error("Error fetching Viewed track:", error);
      throw error;
    }
  }

  async function playAudio() {
    if (audioContext.state === "suspended") await audioContext.resume();
    await audio.value?.play();
    isPlaying.value = true;
  }

  async function togglePlay() {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    if (isPlaying.value) {
      audio.value?.pause();
      isPlaying.value = false;
    } else {
      await audio.value?.play();
      isPlaying.value = true;
    }
  }

  function changeVolume(event: Event) {
    if (!audio.value) return;
    const input = event.target as HTMLInputElement;
    if (input.value != null) {
      volume.value = Number(input.value);
      gainNode.gain.value = volume.value;
    }
  }

  function changeSeek(event: Event) {
    if (!audio.value) return;
    const input = event.target as HTMLInputElement;
    const percent = Number(input.value); // 0–100
    const seekTime = (percent / 100) * audio.value.duration;
    audio.value.currentTime = seekTime;
  }

  // function nextTrack() {
  //   if (currentIndex.value + 1 < tracks.value.length) {
  //     currentIndex.value++;
  //     playTrack(currentTrack.value!);
  //   }
  // }

  // function prevTrack() {
  //   if (currentIndex.value - 1 >= 0) {
  //     currentIndex.value--;
  //     playTrack(currentTrack.value!);
  //   }
  // }

  return {
    tracks,
    currentTrack,
    viewedTrack,
    currentTime,
    duration,
    audio,
    progress,
    //currentIndex,
    isPlaying,
    fetchTracks,
    fetchTrackbyId,
    togglePlay,
    setCurrentTrack,
    volume,
    changeVolume,
    changeSeek,
  };
});

// import { defineStore } from "pinia";
// import axiosClient from "../axios";

// const useTrackStore = defineStore("track", {
//   state: () => ({
//     track: null,
//   }),
//   actions: {
//     async fetchTracks(userId: string) {
//       try {
//         const { data } = await axiosClient.get(`/api/user/${userId}/tracks`);
//         this.track = data;
//         console.log("Track data fetched:", data);
//         return data;
//       } catch (error) {
//         console.error("Error fetching track data:", error);
//         throw error;
//       }
//     },
//   },
// });

// export default useTrackStore;
