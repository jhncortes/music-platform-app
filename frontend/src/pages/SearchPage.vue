<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import axiosClient from "../axios";
import type { Track } from "../types/Track";
import useUserStore from "../store/user";
import type { User } from "../types/User";
import AudioCard from "../components/AudioCard.vue";
import { useTrackStore } from "../store/track";
import router from "../router";

//const tracks = ref<Track[]>([]);
const trackStore = useTrackStore();
const userStore = useUserStore();

const user = computed<User | null>(() => userStore.user);
const tracks = computed<Track[] | null>(() => trackStore.tracks);

const searchQuery = router.currentRoute.value.query.q;

onMounted(async () => {
  try {
    console.log(searchQuery);
    await trackStore.fetchTracks(`?search=${searchQuery}`);
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
});
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold tracking-tight">
      Search for "{{ searchQuery }}"
    </h1>
    <p>Discover music tracks around the globe</p>
  </div>
  <div class="my-12">
    <!-- <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> -->

    <!-- <div class="md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> -->
    <div class="grid grid-cols-1 w-full">
      <div
        v-for="(track, index) in tracks"
        :key="track.id"
        class="overflow-hidden rounded-lg flex flex-col"
      >
        <div class="flex gap-6 p-4 items-center w-full">
          <p class="text-sm font-bold">{{ index + 1 }}</p>
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
  </div>
</template>

<style scoped></style>
