<script setup lang="ts">
import { computed } from "vue";
import { useTrackStore } from "../store/track";
import {
  HeartIcon,
  ChatBubbleBottomCenterIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from "@heroicons/vue/24/solid";
import router from "../router";

const props = defineProps<{
  id?: number;
  creator?: string;
  creatorId?: number;
  title?: string;
  imageUrl?: string;
  audioSource?: string;
  genre?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
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
    createdAt: props.createdAt,
    updatedAt: props.updatedAt,
  });
}
</script>

<template>
  <div
    class="flex justify-between rounded-lg transition-colors p-4 hover:bg-neutral-800"
  >
    <div class="flex gap-6 items-center">
      <button @click="togglePlay">
        <PauseCircleIcon
          v-if="isPlaying"
          class="w-10 h-10 hover:text-neutral-500 transition-colors text-white"
        />
        <PlayCircleIcon
          fill="white"
          v-else
          class="w-10 h-10 hover:text-neutral-500 transition-colors"
        />
      </button>
      <img :src="props.imageUrl" alt="Image" class="rounded-lg h-28 w-28" />

      <div class="flex">
        <div>
          <div class="flex gap-2">
            <a
              class="text-lg font-bold cursor-pointer"
              @click="
                props.id &&
                  router.push({
                    name: 'TrackInfo',
                    params: { trackId: props.id },
                  })
              "
            >
              {{ props.title }}
            </a>
          </div>
          <a
            class="text-neutral-500 text-sm hover:text-neutral-300 hover:cursor-pointer transition-colors"
            @click="
              props.creator &&
                router.push({
                  name: 'UserProfile',
                  params: { username: props.creator },
                })
            "
          >
            {{ props.creator }}
          </a>
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
