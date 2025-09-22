<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import axiosClient from "../axios";
import type { Track } from "../types/Track";
import useUserStore from "../store/user";
import type { User } from "../types/User";
import { useTrackStore } from "../store/track";
import AudioCard from "../components/AudioCard.vue";

const userStore = useUserStore();
const trackStore = useTrackStore();
const user = computed<User | null>(() => userStore.user);
const tracks = computed<Track[]>(() => trackStore.tracks);

onMounted(async () => {
  await trackStore.fetchTracks(`?userId=${user.value?.id}`);
});
</script>

<template>
  <header>
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight">My Tracks</h1>
      <p>All of your current uploaded tracks</p>
    </div>
  </header>
  <main>
    <!-- <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> -->
    <div class="mx-4 max-w-7xl my-8">
      <!-- <div class="md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> -->
      <div class="md:grid grid-cols-1">
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
            :creatorProfile="track.creatorProfile"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
