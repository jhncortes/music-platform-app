<script setup lang="ts">
import { computed, ref } from "vue";
import useUserStore from "../store/user";
import type { User, UserProfile, UserProfileData } from "../types/User";
import type { Track } from "../types/Track";
import useUserProfileStore from "../store/userProfile";
import axiosClient from "../axios";
import DefaultAvatar from "../assets/default_avatar.png";
import {
  PencilSquareIcon,
  LockClosedIcon,
  InformationCircleIcon,
  BellIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/24/outline";
import { putToS3 } from "../services/s3";

const userStore = useUserStore();
const userProfileStore = useUserProfileStore();
const user = computed<User | null>(() => userStore.user);
const userProfile = computed<UserProfile | null>(
  () => userProfileStore.userProfile
);

const profileData = ref<UserProfileData>({
  bio: "",
  image: null,
});

async function submitChanges() {
  try {
    const formData = new FormData();
    // Only append bio if it exists
    if (profileData.value.bio) {
      formData.append("bio", profileData.value.bio);
    }
    // Only append avatar if it exists
    if (profileData.value.image) {
      formData.append("image", profileData.value.image);
    }
    // Spoof PATCH method
    formData.append("_method", "PATCH");

    const response = await axiosClient.post(
      `/api/profile/${user.value?.id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (profileData.value.image) {
      try {
        console.log("Uploading image to S3...");
        const s3Response = await putToS3(
          response.data.presignedUrl,
          profileData.value.image
        );
        console.log("Image uploaded to S3:", s3Response);
      } catch (error) {
        console.error("Error uploading image to S3:", error);
      }
    }

    console.log("User profile updated:", response.data);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}
</script>

<template>
  <header>
    <div class="mx-auto max-w-7xl px-4 py-4">
      <h1 class="text-4xl font-bold tracking-tight">Settings</h1>
      <p>Customize your experience</p>
    </div>
  </header>
  <main>
    <div class="mt-10 mx-auto px-4 flex gap-6">
      <div class="p-4 w-2/6 outline-1 rounded-2xl outline-white/10 text-md">
        <span class="flex p-4 rounded-xl hover:bg-white/5 transition-colors">
          <PencilSquareIcon class="w-6 mr-1" />
          <label class="">Edit Profile</label>
        </span>
        <span class="flex p-4 rounded-xl hover:bg-white/5 transition-colors">
          <LockClosedIcon class="w-6 mr-1" />
          <label> Privacy and Security </label>
        </span>
        <span class="flex p-4 rounded-xl hover:bg-white/5 transition-colors">
          <BellIcon class="w-6 mr-1" />
          <label> Notifications</label>
        </span>
        <span class="flex p-4 rounded-xl hover:bg-white/5 transition-colors">
          <InformationCircleIcon class="w-6 mr-1" />
          <label> Support and Help </label>
        </span>
        <span class="flex p-4 rounded-xl hover:bg-white/5 transition-colors">
          <QuestionMarkCircleIcon class="w-6 mr-1" />
          <label> About </label>
        </span>
      </div>
      <form @submit.prevent="submitChanges" class="space-y-6 w-4/6">
        <!-- <div>
          <label
            for="username"
            class="block text-sm/6 font-medium text-gray-100"
            >Username</label
          >
          <div class="mt-2">
            <input
              id="username"
              type="username"
              name="username"
              required
              autocomplete="username"
              class="block max-w-xs w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div> -->
        <div>
          <label
            for="biography"
            class="block text-sm/6 font-medium text-gray-100"
            >Profile Picture</label
          >
          <div
            class="p-5 my-1.5 flex rounded-2xl outline-1 outline-white/10 bg-white/5 items-center justify-between"
          >
            <div class="flex items-center">
              <img :src="DefaultAvatar" class="h-20" />
              <div class="ml-4">
                <p class="text-xl font-bold">{{ user?.username }}</p>
                <p>{{ user?.name }}</p>
              </div>
            </div>

            <!-- Upload Button -->
            <label
              for="avatar-upload"
              class="cursor-pointer px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-400 ml-12"
            >
              Change Avatar
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              class="hidden"
              @change="
                profileData.image =
                  ($event.target as HTMLInputElement).files?.[0] ?? null
              "
            />
          </div>
        </div>

        <div>
          <label
            for="biography"
            class="block text-sm/6 font-medium text-gray-100"
            >Biography</label
          >
          <div class="mt-2">
            <input
              v-model="profileData.bio"
              id="biography"
              type="biography"
              name="biography"
              autocomplete="biography"
              class="block w-full h-20 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
