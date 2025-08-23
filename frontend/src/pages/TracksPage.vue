<script setup lang="ts">
import { ref } from "vue";

//const tracks = ref([]);

const tracks = [
  {
    id: 1,
    name: "Track 1",
    label: "Label 1",
    url: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Track 2",
    label: "Label 2",
    url: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Track 3",
    label: "Label 3",
    url: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Track 4",
    label: "Label 4",
    url: "https://via.placeholder.com/150",
  },
];
</script>

<template>
  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">My Tracks</h1>
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
          class="bg-white overflow-hidden shadow rounded-lg"
        >
          <img
            :src="track.url"
            alt="Image"
            class="w-full h-48 object-contain"
          />
          <div class="px-4 py-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ track.name }}
            </h3>
            <p class="text-sm text-gray-500 mb-4">{{ track.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
