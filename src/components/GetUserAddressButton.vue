<script setup lang="ts">
import { getCurrentAddress } from "@/utils/Location";
const emit = defineEmits<{(e: "getAddress", address: string): void}>();
function fetchUserAddress(event: MouseEvent) {
  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;
      const address = await getCurrentAddress(latitude, longitude);
      emit("getAddress", address);
    },
    error => {
      console.log("error", error);
    }
  )
}
</script>

<template>
  <button @click="fetchUserAddress">Get My Location</button>
</template>

<style scoped>
</style>
