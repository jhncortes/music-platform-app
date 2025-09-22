<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import axiosClient from "../axios";
import type { Track } from "../types/Track";
import AudioPlayer from "../components/AudioCard.vue";
import useUserStore from "../store/user";
import type { User } from "../types/User";
import AudioCard from "../components/AudioCard.vue";
import { useTrackStore } from "../store/track";

//const tracks = ref<Track[]>([]);
const trackStore = useTrackStore();
const userStore = useUserStore();
const user = computed<User | null>(() => userStore.user);
const tracks = computed<Track[] | null>(() => trackStore.tracks);

onMounted(async () => {
  try {
    await trackStore.fetchTracks();
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
});
</script>

<template>
  <header class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold tracking-tight">My Home</h1>
    <p>Discover music tracks around the globe</p>
  </header>
  <main>
    <!-- <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> -->
    <div class="mx-4 max-w-7xl my-8 flex gap-4">
      <div class="p-4 sticky top-20">
        <p class="font-bold mb-2 text-nowrap text-xl">My Followings</p>
        <div class="space-x-14" v-for="track in tracks">
          <p class="text-sm text-neutral-400 mb-2">{{ user?.username }}</p>
        </div>
      </div>
      <!-- <div class="md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> -->
      <div class="md:grid grid-cols-1 w-full">
        <div
          v-for="track in tracks"
          :key="track.id"
          class="overflow-hidden rounded-lg flex flex-col"
        >
          <AudioCard
            :title="track.title"
            :imageUrl="track.imageUrl"
            :audioUrl="track.audioUrl"
            :id="track.id"
            :genre="track.genre"
            :description="track.description"
            :createdAt="track.createdAt"
            :updatedAt="track.updatedAt"
            :likes="track.likes"
            :isLiked="track.isLiked"
            :creatorProfile="track.creatorProfile"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
