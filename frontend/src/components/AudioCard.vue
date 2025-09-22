<script setup lang="ts">
import { computed, ref } from "vue";
import { useTrackStore } from "../store/track";
import {
  HeartIcon,
  ChatBubbleBottomCenterIcon,
  TrashIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from "@heroicons/vue/24/solid";
import router from "../router";
import useUserStore from "../store/user";
import type { User } from "../types/User";
import axiosClient from "../axios";
import type { Track } from "../types/Track";
import axios from "axios";

const props = defineProps<Track>();

const trackStore = useTrackStore();
const userStore = useUserStore();

// Set to default or latest value from props upon refresh
const isLiked = ref(props.isLiked);
const likes = ref(props.likes ?? 0);

const user = computed<User | null>(() => userStore.user);
const isPlaying = computed(
  () => trackStore.isPlaying && trackStore.currentTrack?.id === props.id
);

function togglePlay() {
  trackStore.setCurrentTrack({
    id: props.id,
    title: props.title,
    imageUrl: props.imageUrl,
    audioUrl: props.audioUrl,
    genre: props.genre,
    description: props.description,
    createdAt: props.createdAt,
    updatedAt: props.updatedAt,
    creatorProfile: props.creatorProfile,
  });
}

async function deleteTrack(trackId?: number) {
  try {
    if (!confirm("Are you sure you want to delete this track?")) {
      return;
    }
    const response = await axiosClient.delete(`/api/tracks/${trackId}`);
    // Optionally, remove the track from the local state
    trackStore.tracks = trackStore.tracks.filter(
      (track) => track.id !== trackId
    );
    console.log("Successfully deleted track:", response);
  } catch (error) {
    console.error("Error deleting track:", error);
  }
}

async function toggleLikeButton(trackId?: number) {
  try {
    if (!isLiked.value || !likes.value) {
      const likedResponse = await axiosClient.post(
        `/api/tracks/${trackId}/like`
      );
      // Handle locally
      isLiked.value = true;
      likes.value += 1;
      console.log("Successfully liked track:", likedResponse);
    } else {
      const dislikedResponse = await axiosClient.delete(
        `/api/tracks/${trackId}/unlike`
      );
      // Handle locally
      isLiked.value = false;
      likes.value -= 1;
      console.log("Successfully unliked track:", dislikedResponse);
    }
  } catch (error) {
    console.error("Error pressing like button:", error);
  }
}
</script>

<template>
  <div
    class="flex justify-between rounded-lg transition-colors p-4 hover:bg-neutral-800"
  >
    <div class="flex gap-6 items-center">
      <img :src="props.imageUrl" alt="Image" class="rounded-lg h-32 w-32" />
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
            class="text-neutral-400 text-sm hover:text-neutral-300 hover:cursor-pointer transition-colors"
            @click="
              props.creatorProfile?.username &&
                router.push({
                  name: 'UserProfile',
                  params: { username: props.creatorProfile?.username },
                })
            "
          >
            {{ props.creatorProfile?.username }}
          </a>
          <p class="text-neutral-400 text-sm">{{ likes }} likes</p>
          <div class="flex gap-2 mt-4 text-xs">
            <button @click="togglePlay" class="w-10 h-10 hover:cursor-pointer">
              <PauseCircleIcon
                v-if="isPlaying"
                class="hover:text-neutral-500 transition-colors text-white"
              />
              <PlayCircleIcon
                fill="white"
                v-else
                class="hover:text-neutral-500 transition-colors"
              />
            </button>
            <button
              v-if="props.creatorProfile?.id === user?.id"
              @click="deleteTrack(props.id)"
              class="rounded-lg p-2 bg-neutral-100 text-neutral-950 flex items-center gap-1 text-xs font-semibold hover:bg-neutral-300 hover:cursor-pointer transition-all"
            >
              <TrashIcon class="h-4 w-4" />
              Delete
            </button>
            <button
              @click="toggleLikeButton(props.id)"
              v-if="props.creatorProfile?.id != user?.id"
              class="hover:cursor-pointer transition-all flex items-center gap-1 text-xs font-semibold rounded-lg p-2"
              :class="{
                ' bg-neutral-100 text-neutral-950  hover:bg-neutral-300':
                  !isLiked,
                'bg-neutral-700 hover:bg-neutral-500': isLiked,
              }"
            >
              <HeartIcon class="h-4 w-4" />
              {{ isLiked ? "Liked" : "Like" }}
            </button>
            <button
              @click="
                props.id &&
                  router.push({
                    name: 'TrackInfo',
                    params: { trackId: props.id },
                  })
              "
              class="rounded-lg p-2 bg-neutral-100 text-neutral-950 flex items-center gap-1 text-xs font-semibold hover:bg-neutral-300 hover:cursor-pointer transition-all"
            >
              <ChatBubbleBottomCenterIcon class="h-4 w-4" />
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="text-sm text-neutral-100 bg-neutral-700 p-2 rounded-xl h-fit font-semibold"
    >
      # {{ props.genre }}
    </div>
  </div>
</template>
