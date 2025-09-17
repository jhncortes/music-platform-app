<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import axiosClient from "../axios";
import type { Track } from "../types/Track";
import AudioPlayer from "../components/AudioCard.vue";
import useUserStore from "../store/user";
import type { User } from "../types/User";
import AudioCardNew from "../components/AudioCardNew.vue";

const tracks = ref<Track[]>([]);
const userStore = useUserStore();
const user = computed<User | null>(() => userStore.user);

function deleteTrack(trackId: number) {
  if (!confirm("Are you sure you want to delete this track?")) {
    return;
  }
  axiosClient
    .delete(`/api/tracks/${trackId}`)
    .then((response) => {
      console.log("Track deleted successfully:", response.data);
      // Optionally, remove the track from the local state
      tracks.value = tracks.value.filter((track) => track.id !== trackId);
    })
    .catch((error) => {
      console.error("Error deleting track:", error);
    });
}

onMounted(async () => {
  try {
    const response = await axiosClient.get("/api/tracks");
    tracks.value = response.data;
    console.log("Tracks fetched successfully:", response.data);
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
          <!-- <img :src="track.imageUrl" alt="Image" class="h-48" />
          <div class="px-4 py-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ track.title }}
            </h3>
            <p class="text-sm text-gray-500 mb-4">{{ track.description }}</p>
            <p class="text-sm text-gray-500 mb-4">{{ track.genre }}</p>
          </div> -->
          <!-- <button
            @click="deleteTrack(track.id)"
            type="submit"
            class="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Delete Track
          </button> -->

          <!-- <AudioPlayer
            :audioSource="track.audioUrl"
            :creator="user?.name"
            :title="track.title"
            :imageUrl="track.imageUrl"
          /> -->
          <AudioCardNew
            :audioSource="track.audioUrl"
            :creatorId="track.creatorId"
            :creator="track.creator"
            :title="track.title"
            :imageUrl="track.imageUrl"
            :id="track.id"
            :genre="track.genre"
            :description="track.description"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
