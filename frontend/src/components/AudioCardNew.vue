<script setup lang="ts">
import { computed } from "vue";
import { useTrackStore } from "../store/track";
import {
  PlayCircleIcon,
  PauseCircleIcon,
  HeartIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps<{
  id: number;
  creator: string | null;
  creatorId: number;
  title: string;
  imageUrl: string;
  audioSource: string;
  genre: string;
  description: string;
}>();

const trackStore = useTrackStore();
const isPlaying = computed(
  () => trackStore.isPlaying && trackStore.currentTrack?.id === props.id
);
const isActive = computed(() => trackStore.currentTrack?.id === props.id);

function togglePlay() {
  trackStore.setCurrentTrack({
    id: props.id,
    creatorId: props.creatorId,
    creator: props.creator,
    title: props.title,
    imageUrl: props.imageUrl,
    audioUrl: props.audioSource,
    genre: props.genre,
    description: props.description,
  });
}
</script>

<template>
  <div
    class="flex justify-between rounded-lg transition-colors p-4 cursor-pointer hover:bg-neutral-800 group-target:"
    @click="togglePlay"
  >
    <div class="flex gap-6 items-center">
      <img :src="props.imageUrl" alt="Image" class="rounded-lg h-28 w-28" />

      <div class="flex">
        <div>
          <div class="flex gap-2">
            <p class="text-lg font-bold">{{ props.title }}</p>
          </div>
          <p class="text-neutral-500 text-sm">
            {{ props.creator }}
          </p>
          <p class="text-neutral-500 text-sm">23.0k likes * 32 plays</p>
          <div class="flex gap-2 mt-4 text-xs">
            <div class="rounded-lg p-2 bg-neutral-700 flex items-center gap-1">
              <HeartIcon class="h-4 w-4" />
              <p>Like</p>
            </div>
            <div class="rounded-lg p-2 bg-neutral-700 flex items-center gap-1">
              <ChatBubbleBottomCenterIcon class="h-4 w-4" />
              <p>Comment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-sm text-neutral-400 bg-neutral-700 p-2 rounded-xl h-fit">
      #{{ props.genre }}
    </div>

    <!-- <img :src="props.imageUrl" alt="Image" class="h-48" /> -->
  </div>
</template>
