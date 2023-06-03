<script setup lang="ts">
import L from "leaflet";
import axios from "axios";

import { onMounted, ref } from "vue";

import { type Nominatim } from "./types";

let displayLocation = ref("");

onMounted(() => {
  // L.map()
})

function fetchUserLocation(event: MouseEvent) {
  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;
      // for human readable address
      const nominatimResp = await axios.get<Nominatim>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);

      // console.log("nominatimResp", nominatimResp.data.display_name);
      displayLocation.value = nominatimResp.data.display_name;
      console.log(displayLocation)
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
    <p>Your location is: {{displayLocation}}</p>
  </main>
</template>

<style scoped>
</style>
