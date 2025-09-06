<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { UserProfile } from "../types/User";
import useUserProfileStore from "../store/userProfile";
import useTrackStore from "../store/track";
import type { Track } from "../types/Track";
import AudioPlayer from "../components/AudioPlayer.vue";
import axiosClient from "../axios";

const userProfileStore = useUserProfileStore();
const trackStore = useTrackStore();

const userProfile = computed<UserProfile | null>(
  () => userProfileStore.userProfile
);

const tracks = ref<Track[]>([]);

onMounted(async () => {
  try {
    const response = await axiosClient.get(
      `/api/user/${userProfile.value?.id}/tracks`
    );
    tracks.value = response.data;
    console.log("Tracks fetched successfully:", response.data);
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
});
</script>

<template>
  <main>
    <header class="flex gap-6">
      <img src="https://avatar.iran.liara.run/public" class="w-40 h-40" />
      <div>
        <h1 class="text-4xl font-semibold mb-1">{{ userProfile?.username }}</h1>
        <h2 class="text-sm">{{ userProfile?.name }}</h2>
        <h2 class="text-sm">{{ userProfile?.bio }}</h2>
      </div>
    </header>
    <div
      v-if="tracks && userProfile"
      v-for="track in tracks"
      :key="track.id"
      class="grid grid-cols-1 my-12"
    >
      <AudioPlayer
        :audioSource="track.audioUrl"
        :creator="userProfile.name"
        :title="track.title"
        :imageUrl="track.imageUrl"
      />
    </div>
  </main>
</template>

<style scoped></style>
