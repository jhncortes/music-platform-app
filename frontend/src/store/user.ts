import axios from "axios";
import { defineStore } from "pinia";
import axiosClient from "../axios";

const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser() {
      try {
        const { data } = await axiosClient.get("/api/user");
        this.user = data;
        console.log("User data fetched:", data);
        return data;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },
  },
});

export default useUserStore;
