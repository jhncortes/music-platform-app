<script setup lang="ts">
import { PhotoIcon, MusicalNoteIcon } from "@heroicons/vue/24/solid";

import { ref } from "vue";
import axiosClient from "../axios";
import router from "../router";

interface TrackData {
  image: File | null;
  title: string;
}

const data = ref<TrackData>({
  image: null,
  title: "",
});

function submit() {
  // Handle form submission logic here
  console.log("Form submitted with data:", data.value);
  // You can use axios to send the data to your backend
  // axios.post('/api/tracks', data.value)
  //   .then(response => console.log('Track uploaded:', response.data))
  //   .catch(error => console.error('Error uploading track:', error));

  const formData = new FormData();
  formData.append("image", data.value.image as File);
  formData.append("title", data.value.title);
  axiosClient
    .post("/api/tracks", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("Presigned URL received:", response.data);
      axiosClient
        .put(response.data, data.value.image, {
          headers: {
            "Content-Type": data.value.image
              ? data.value.image.type
              : "application/octet-stream",
          },
          withCredentials: false,
        })
        .then((response) => {
          console.log("File uploaded to S3 successfully", response);
        })
        .catch((error) => {
          console.error("Error uploading file to S3:", error);
        });
      //router.push({ name: "Tracks" });
      console.log("Track uploaded successfully");
      // Optionally, reset the form or redirect
      data.value = { image: null, title: "" };
    })
    .catch((error) => {
      console.error("Error uploading track:", error);
    });
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
                  data.image =
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
                    data.image =
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
        <label for="title" class="block text-sm/6 font-medium text-white"
          >Title</label
        >
        <div class="mt-2 mb-4">
          <input
            v-model="data.title"
            type="text"
            name="title"
            id="title"
            class="block w-full flex-1 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
        <label for="title" class="block text-sm/6 font-medium text-white"
          >Description</label
        >
        <div class="mt-2 mb-4">
          <input
            v-model="data.title"
            type="text"
            name="title"
            id="title"
            class="block w-full flex-1 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
        <label for="title" class="block text-sm/6 font-medium text-white"
          >Genre</label
        >
        <div class="mt-2 mb-4">
          <input
            v-model="data.title"
            type="text"
            name="title"
            id="title"
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
