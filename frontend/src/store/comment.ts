import { defineStore } from "pinia";
import { ref } from "vue";
import { useTrackStore } from "./track";
import type { Comment } from "../types/Comment";

export const useCommentStore = defineStore("comment", () => {
  const comments = ref<Comment[]>([]);

  return { comments };
});
