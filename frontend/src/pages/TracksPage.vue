<script setup lang="ts">
import { onMounted, ref } from "vue";
import axiosClient from "../axios";

//const tracks = ref([]);

interface Track {
  id: number;
  name: string;
  title: string;
  url: string;
}

const tracks = ref<Track[]>([]);

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
  <header>
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight">My Tracks</h1>
      <p>All of your current uploaded tracks</p>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="track in tracks"
          :key="track.id"
          class="overflow-hidden shadow rounded-lg p-4 bg-neutral-300"
        >
          <img
            :src="track.url"
            alt="Image"
            class="w-full h-48 object-contain"
          />
          <div class="px-4 py-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ track.title }}
            </h3>
            <p class="text-sm text-gray-500 mb-4">{{ track.url }}</p>
          </div>
          <button
            @click="deleteTrack(track.id)"
            type="submit"
            class="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Delete Track
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
