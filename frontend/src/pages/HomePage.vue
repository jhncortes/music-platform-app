<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import axiosClient from "../axios";
import type { Track } from "../types/Track";
import AudioPlayer from "../components/AudioCard.vue";
import useUserStore from "../store/user";
import type { User } from "../types/User";

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
  <header>
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight">My Home</h1>
      <p>Discover all types of music around the globe</p>
    </div>
  </header>
  <main>
    <!-- <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> -->
    <div class="mx-4 max-w-7xl my-8">
      <div class="grid grid-cols-1 gap-8">
        <div
          v-for="track in tracks"
          :key="track.id"
          class="overflow-hidden rounded-xl p-4 transition-colors"
        >
          <!-- <button
            @click="deleteTrack(track.id)"
            type="submit"
            class="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Delete Track
          </button> -->

          <AudioPlayer
            :audioSource="track.audioUrl"
            :creator="user?.name"
            :title="track.title"
            :imageUrl="track.imageUrl"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
