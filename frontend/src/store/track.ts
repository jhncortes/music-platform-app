import { defineStore } from "pinia";
import axiosClient from "../axios";

const useTrackStore = defineStore("track", {
  state: () => ({
    track: null,
  }),
  actions: {
    async fetchTracks(userId: string) {
      try {
        const { data } = await axiosClient.get(`/api/user/${userId}/tracks`);
        this.track = data;
        console.log("Track data fetched:", data);
        return data;
      } catch (error) {
        console.error("Error fetching track data:", error);
        throw error;
      }
    },
  },
});

export default useTrackStore;
