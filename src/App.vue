<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getCurrentAddress } from "./utils/Location"

let displayAddress = ref("");

onMounted(() => {
  // L.map()
})

function fetchUserLocation(event: MouseEvent) {
  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;
      displayAddress.value = await getCurrentAddress(latitude, longitude);
    },
    error => {
      console.log("error", error)
    }
  )
}
</script>

<template>
  <main>
    <button @click="fetchUserLocation">Get My Location</button>
    <p>Your location is: {{displayAddress}}</p>
  </main>
</template>

<style scoped>
</style>
