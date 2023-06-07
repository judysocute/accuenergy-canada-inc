<script setup lang="ts">
import { getCurrentAddress } from "@/utils/Location";
import { type Nominatim } from "@/types";
const emit = defineEmits<{(e: "getAddress", address: Nominatim): void}>();
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
  <v-btn
    prepend-icon="mdi-map-marker-outline"
    variant="tonal"
    @click="fetchUserAddress"
    width="400"
  >Get My Location</v-btn>
</template>

<style scoped>
</style>
