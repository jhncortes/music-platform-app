<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/vue/24/solid";
import { useTrackStore } from "../store/track";

const props = defineProps<{
  creator: string | undefined;
  title: string;
  imageUrl: string;
  audioSource: string;
}>();

const trackStore = useTrackStore();

const audio = ref<HTMLAudioElement | null>(null);
const audioContext = new AudioContext();
const progressBar = ref<HTMLInputElement | null>(null);
const volumeBar = ref<HTMLInputElement | null>(null);
const waveformCanvas = ref<HTMLCanvasElement | null>(null);

const isPlaying = ref<boolean>(false);
const duration = ref<number>(0); // keep as formatted string
const currentTime = ref<number>(0);
const volume = ref<number>(0.4);

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function seekTo(time: number) {
  if (audio.value) {
    audio.value.currentTime = time;
  }
}

function changeVolume(gainNode: GainNode) {
  if (volumeBar.value != null) {
    volume.value = Number(volumeBar.value.value);
    gainNode.gain.value = volume.value;
  }
}
async function togglePlay() {
  console.log("Setting current track", props.title);
  trackStore.setCurrentTrack({
    id: 0,
    title: props.title,
    description: "",
    genre: "",
    imageUrl: props.imageUrl,
    audioUrl: props.audioSource,
  });
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

async function getAudioBufferFromElement(
  audioElement: HTMLAudioElement | null,
  audioContext: AudioContext
): Promise<AudioBuffer | null> {
  if (audioElement) {
    const src = audioElement.currentSrc || audioElement.src;
    if (!src) throw new Error("Audio element has no source");

    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  }
  return null;
}

function extractWaveformData(
  audioBuffer: AudioBuffer,
  samples = 1000
): number[] {
  const rawData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(rawData.length / samples);
  const waveform: number[] = [];

  for (let i = 0; i < samples; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[i * blockSize + j]);
    }
    waveform.push(sum / blockSize);
  }

  return waveform;
}

function drawWaveform(
  canvas: HTMLCanvasElement,
  waveform: number[],
  progress = 0
): void {
  const ctx = canvas.getContext("2d")!;
  const width = canvas.width;
  const height = canvas.height;
  const barWidth = width / waveform.length;

  ctx.clearRect(0, 0, width, height);

  waveform.forEach((value, i) => {
    const barHeight = value * height;
    ctx.fillStyle = i / waveform.length <= progress ? "#ffffff" : "#888888";

    ctx.fillRect(i * barWidth, (height - barHeight) / 2, barWidth, barHeight);
  });
}

function normalizePeaks(waveform: number[]): number[] {
  const max = Math.max(...waveform); // find highest peak
  if (max === 0) return waveform; // avoid division by zero
  return waveform.map((v) => v / max); // scale all values to 0–1
}

async function initializeAudio() {
  if (!audio.value || !waveformCanvas.value) return;

  const source = audioContext.createMediaElementSource(audio.value);
  const gainNode = audioContext.createGain();

  let waveformData;
  let normalizedWaveform: number[] = [];

  source.connect(gainNode).connect(audioContext.destination);

  const buffer = await getAudioBufferFromElement(audio.value, audioContext);
  if (buffer) {
    waveformData = extractWaveformData(buffer);
    normalizedWaveform = normalizePeaks(waveformData);
    drawWaveform(waveformCanvas.value, normalizedWaveform);
  }

  // Handle progress bar seeking
  progressBar.value?.addEventListener("input", () => {
    if (!audio.value || !progressBar.value) return;
    const value = Number(progressBar.value.value); // 0–100
    const seekTime = (value / 100) * audio.value.duration;
    seekTo(seekTime);
  });

  // Handle progress bar seeking
  volumeBar.value?.addEventListener("input", () => {
    changeVolume(gainNode);
  });

  // Update current time as audio plays
  audio.value.addEventListener("timeupdate", () => {
    currentTime.value = audio.value ? audio.value.currentTime : 0;

    // Update progress bar
    if (progressBar.value) {
      const progress = currentTime.value / duration.value;
      // progressBar.value.value = (
      //   (audio.value!.currentTime / audio.value!.duration) *
      //   100
      // ).toString();
      drawWaveform(waveformCanvas.value!, normalizedWaveform, progress);
    }
  });

  audio.value.addEventListener("ended", () => {
    isPlaying.value = false;
  });
}

onMounted(() => {
  if (!audio.value) return;

  audio.value.crossOrigin = "anonymous";

  // Attach the listener first
  audio.value.addEventListener("loadedmetadata", () => {
    duration.value = audio.value?.duration ?? 0;
    console.log("Duration loaded:", duration.value);
  });

  // Then set the source
  audio.value.src = props.audioSource;

  // Finally initialize everything else
  initializeAudio();
});
</script>

<template>
  <div>
    <!-- attach ref so script can control this audio element -->
    <audio ref="audio" preload="metadata"></audio>
    <div class="flex w-full">
      <img :src="imageUrl" alt="Image" class="rounded-2xl h-42 w-42" />
      <div class="flex flex-col w-full">
        <div class="mx-3 flex gap-3 items-start">
          <button @click="togglePlay">
            <PlayCircleIcon
              v-if="!isPlaying"
              class="w-12 h-12 hover:text-neutral-500 transition-colors m-0 p-0"
            />
            <PauseCircleIcon
              v-else
              class="w-12 h-12 hover:text-neutral-500 transition-colors m-0 p-0"
            />
          </button>
          <div>
            <h3 class="text-lg font-semibold">
              {{ title }}
            </h3>
            <p class="text-sm text-neutral-400 mb-4">{{ creator }}</p>
          </div>
        </div>
        <div class="inline-block gap-2 w-full mx-4">
          <div class="relative w-full h-26">
            <!-- Waveform Canvas -->
            <!-- <canvas
              ref="waveformCanvas"
              class="absolute top-0 left-0 w-full h-full"
            ></canvas> -->

            <!-- Hidden progress bar overlay -->
            <input
              ref="progressBar"
              type="range"
              min="0"
              max="100"
              value="0"
              class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />

            <!-- Current Time (Bottom Left) -->
            <span class="absolute bottom-1 left-2 text-sm text-white">
              {{ formatTime(currentTime) }}
            </span>

            <!-- Duration (Bottom Right) -->
            <span class="absolute bottom-1 right-8 text-sm text-white">
              {{ formatTime(duration) }}
            </span>
          </div>
        </div>
      </div>

      <!-- <div>
        <input ref="volumeBar" type="range" min="0" step="0.01" max="2" v-model="volume"></input>  
      </div> -->
    </div>
  </div>
</template>
