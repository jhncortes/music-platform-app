<script setup lang="ts">
import {
  PlayCircleIcon,
  PauseCircleIcon,
  SpeakerWaveIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/solid";

import { useTrackStore } from "../store/track";
import { computed, onMounted, ref, watch } from "vue";
import { formatTime } from "../utils/time";
import router from "../router";

const trackStore = useTrackStore();
const currentTrack = computed(() => trackStore.currentTrack);

const isPlaying = computed(
  () => trackStore.isPlaying && !!trackStore.currentTrack
);

onMounted(() => {
  console.log(currentTrack.value?.creatorProfile);
});
</script>

<template>
  <div
    class="w-full bg-neutral-900 h-20 fixed bottom-0 z-50 grid grid-cols-3 items-center px-8"
  >
    <div class="flex items-center gap-4 text-white">
      <img :src="currentTrack?.imageUrl" class="h-12 w-12 rounded-md" />
      <div class="inline-block">
        <p
          class="font-bold hover:cursor-pointer hover:text-neutral-400 transition-all"
          @click="
            currentTrack &&
              router.push({
                name: 'TrackInfo',
                params: { trackId: currentTrack?.id },
              })
          "
        >
          {{ currentTrack?.title }}
        </p>
        <p
          class="text-sm text-neutral-400 hover:cursor-pointer hover:text-neutral-300 transition-all"
          @click="
            currentTrack &&
              router.push({
                name: 'UserProfile',
                params: { username: currentTrack?.creatorProfile?.username },
              })
          "
        >
          {{ currentTrack?.creatorProfile?.username }}
        </p>
      </div>
    </div>
    <div class="flex justify-center items-center gap-4">
      <div class="flex items-center">
        <button>
          <ChevronLeftIcon
            class="w-8 h-8 hover:text-neutral-500 transition-colors m-0 p-0"
          />
        </button>
        <button @click="trackStore.togglePlay()">
          <PauseCircleIcon
            v-if="isPlaying"
            class="w-12 h-12 hover:text-neutral-500 transition-colors"
          />
          <PlayCircleIcon
            fill="white"
            v-else
            class="w-12 h-12 hover:text-neutral-500 transition-colors"
          />
        </button>
        <button>
          <ChevronRightIcon
            class="w-8 h-8 hover:text-neutral-500 transition-colors"
          />
        </button>
      </div>

      <div class="flex justify-center items-center gap-4 w-full max-w-xl">
        <!-- Current time -->
        <p class="text-xs text-neutral-400 w-10 text-right">
          {{ formatTime(trackStore.currentTime) }}
        </p>

        <!-- Seek bar -->
        <input
          type="range"
          min="0"
          max="100"
          step="0.01"
          class="w-full h-1 accent-white cursor-pointer"
          :value="isNaN(trackStore.progress) ? 0 : trackStore.progress * 100"
          @input="trackStore.changeSeek($event)"
        />

        <!-- Duration -->
        <p class="text-xs text-neutral-400 w-10">
          {{ formatTime(trackStore.duration) }}
        </p>
      </div>
    </div>

    <div class="flex justify-end items-center gap-4">
      <SpeakerWaveIcon
        class="w-6 h-6 text-white hover:text-neutral-500 transition-colors m-0 p-0"
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value="1"
        class="max-w-sm h-1 accent-white cursor-pointer"
        @input="trackStore.changeVolume($event)"
      />
    </div>
  </div>
</template>
