<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { type ADDRESS_LEVEL_STRING, type Nominatim }from "./types";
import L, { Marker, type LatLngExpression } from "leaflet";
import { convertToAddressLevelNumber, generateMainMarker } from "@/utils/LeafletMap";
import "leaflet/dist/leaflet.css"

import GetUserAddressButton from "./components/GetUserAddressButton.vue";
import UserSearchBar from "./components/UserSearchBar.vue";

let displayAddress = ref("");
let suggestList = reactive<{ value: Nominatim[]}>({ value: [] });
let mainMap: L.Map;
let mainMarker: Marker;

onMounted(() => {
  mainMap = L.map("mainMap").setView([0, 0], 1);
  L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }
  ).addTo(mainMap);
})

/**
 * initial map status
 */
function initMap() {
  if (mainMarker) {
    mainMarker.remove(); // remove the main marker
  }
}

function addMainMarker(latLng: LatLngExpression, markerTitle: string) {
  initMap();
  mainMarker = generateMainMarker(latLng, markerTitle);
  mainMarker.addTo(mainMap);
}

function focusToLocation(latLng: LatLngExpression, type: ADDRESS_LEVEL_STRING) {
  mainMap.setView(latLng, convertToAddressLevelNumber(type));
}

function getUserCurrentLocation({ lat, lon, display_name, type } : Nominatim) {
  const latLng: LatLngExpression = [+lat, +lon];
  addMainMarker(latLng, "Your current location");
  focusToLocation(latLng, type);
  displayAddress.value = display_name;
}

// User picked a location from suggest list
function pickLocation({ lat, lon, display_name, type } : Nominatim) {
  const latLng: LatLngExpression = [+lat, +lon];
  addMainMarker(latLng, "Location you picked");
  focusToLocation(latLng, type);
  displayAddress.value = display_name;
}
</script>

<template>
  <main>
    <UserSearchBar @get-suggest-list="(itemList) => suggestList.value = itemList" />
    <GetUserAddressButton @get-address="(locationObj) => getUserCurrentLocation(locationObj)"/>
    <p>Your location is: {{displayAddress}}</p>
    <ul>
      <li
        @click="() => pickLocation(suggestItem)"
        v-for="suggestItem in suggestList.value"
        :key="suggestItem.place_id"
      >
        {{ suggestItem.display_name }}
      </li>
    </ul>
    <div id="mainMap"></div>
  </main>
</template>

<style scoped>
#mainMap { height: 500px; }
</style>
