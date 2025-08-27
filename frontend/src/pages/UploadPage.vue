<script setup lang="ts">
import { PhotoIcon, MusicalNoteIcon } from "@heroicons/vue/24/solid";
import type { TrackData } from "../types/Track";
import { ref } from "vue";
import axiosClient from "../axios";
import router from "../router";
import axios from "axios";

const trackData = ref<TrackData>({
  image: null,
  title: "",
  description: "",
  genre: "",
});

async function putToS3(presignedUrl: string, file: File) {
  try {
    const s3Response = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      withCredentials: false,
    });
    console.log("File uploaded to S3 successfully", s3Response);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
  }
}

async function submit() {
  console.log("Form submitted with data:", trackData.value);
  if (!trackData.value.image) throw Error;

  const formData = new FormData();
  formData.append("image", trackData.value.image);
  formData.append("title", trackData.value.title);
  formData.append("description", trackData.value.description);
  formData.append("genre", trackData.value.genre);

  try {
    // Send track metadata to backend
    const response = await axiosClient.post("/api/tracks", formData);
    console.log("Presigned URL received:", response.data);
    const presignedUrl = response.data;
    // Upload to S3
    await putToS3(presignedUrl, trackData.value.image);
    // Reset form
    trackData.value = { image: null, title: "", description: "", genre: "" };
    // Redirect to tracks page
    router.push({ name: "Tracks" });
  } catch (error) {
    console.error("Error preparing upload:", error);
  }
}
</script>

<template>
  <header>
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight">Upload a Track</h1>
      <p>Upload a track in WAV, MP3, OGG format</p>
    </div>
  </header>
  <form @submit.prevent="submit" class="p-8">
    <!-- Uploaded Audio -->
    <div class="col-span-full mb-4">
      <label for="cover-photo" class="block text-sm/6 font-medium text-white"
        >Audio file</label
      >
      <div
        class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10"
      >
        <div class="text-center">
          <MusicalNoteIcon
            class="mx-auto size-12 text-gray-200"
            aria-hidden="true"
          />
          <div class="mt-4 flex text-sm/6 text-gray-400">
            <label
              for="file-upload"
              class="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
            >
              <span>Upload a file</span>
              <input
                @change="
                  trackData.image =
                    ($event.target as HTMLInputElement).files?.[0] ?? null
                "
                id="file-upload"
                name="file-upload"
                type="file"
                class="sr-only"
              />
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <!-- <p class="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p> -->
        </div>
      </div>
    </div>
    <!-- Cover Photo -->
    <div class="grid grid-cols-2 gap-6 items-stretch">
      <div class="flex flex-col">
        <label for="cover-photo" class="block text-sm/6 font-medium text-white"
          >Cover photo</label
        >
        <div
          class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10 h-full"
        >
          <div class="text-center">
            <PhotoIcon
              class="mx-auto size-12 text-gray-200"
              aria-hidden="true"
            />
            <div class="mt-4 flex text-sm/6 text-gray-400">
              <label
                for="file-upload"
                class="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
              >
                <span>Upload a file</span>
                <input
                  @change="
                    trackData.image =
                      ($event.target as HTMLInputElement).files?.[0] ?? null
                  "
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  class="sr-only"
                />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <!-- Title -->
        <label for="title" class="block text-sm/6 font-medium text-white"
          >Title</label
        >
        <div class="mt-2 mb-4">
          <input
            v-model="trackData.title"
            type="text"
            name="title"
            id="title"
            class="block w-full flex-1 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
        <!-- Description -->
        <label for="description" class="block text-sm/6 font-medium text-white"
          >Description</label
        >
        <div class="mt-2 mb-4">
          <input
            v-model="trackData.description"
            type="text"
            name="description"
            id="description"
            class="block w-full flex-1 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
        <!-- Genre -->
        <label for="genre" class="block text-sm/6 font-medium text-white"
          >Genre</label
        >
        <div class="mt-2 mb-4">
          <input
            v-model="trackData.genre"
            type="text"
            name="genre"
            id="genre"
            class="block w-full flex-1 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
      </div>
    </div>

    <button
      type="submit"
      class="mt-4 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-full"
    >
      Upload Track
    </button>
  </form>
</template>

<style scoped></style>
