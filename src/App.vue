<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { type ADDRESS_LEVEL_STRING, type Nominatim }from "./types";
import L, { Marker, type LatLngExpression } from "leaflet";
import { convertToAddressLevelNumber, generateMainMarker } from "@/utils/LeafletMap";
import "leaflet/dist/leaflet.css"

import GetUserAddressButton from "./components/GetUserAddressButton.vue";
import UserSearchBar from "./components/UserSearchBar.vue";

let displayAddress = ref("");
const suggestList = reactive<{ value: Nominatim[]}>({ value: [] });
let mainMap: L.Map;
let mainMarker: Marker;
const searchedPlaces = reactive<{ value: Nominatim[]}>({ value: [] });

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

function addRecordToSearchedPlaces(locationObj : Nominatim) {
  const noDuplicated = searchedPlaces.value.every((item) => {
    if (item.place_id === locationObj.place_id) {
      return false;
    }
    return true;
  });
  if (noDuplicated) {
    // if no duplicate, add the record to queue
    searchedPlaces.value.push(locationObj);
    const currLength = searchedPlaces.value.length;
    if (currLength > 10) {
      // if the record queue size is longer than 10
      // We have to splice the first item to the last item subtract 10 in order to keep it 10.
      searchedPlaces.value.splice(0, currLength - 10);
    }
  }
}

function focusToLocation(latLng: LatLngExpression, type: ADDRESS_LEVEL_STRING) {
  mainMap.setView(latLng, convertToAddressLevelNumber(type));
}

function getUserCurrentLocation(locationObj : Nominatim) {
  const { lat, lon, display_name, type } = locationObj;
  const latLng: LatLngExpression = [+lat, +lon];
  addMainMarker(latLng, "Your current location");
  focusToLocation(latLng, type);
  displayAddress.value = display_name;
  addRecordToSearchedPlaces(locationObj);
}

// User picked a location from suggest list
function pickLocation(locationObj : Nominatim) {
  const { lat, lon, display_name, type } = locationObj;
  const latLng: LatLngExpression = [+lat, +lon];
  addMainMarker(latLng, "Location you picked");
  focusToLocation(latLng, type);
  displayAddress.value = display_name;
  addRecordToSearchedPlaces(locationObj);
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
    <hr />
    <ul>
      <li v-for="place in searchedPlaces.value" :key="place.place_id">
        {{ place.display_name }}
      </li>
    </ul>
    <div id="mainMap"></div>
  </main>
</template>

<style scoped>
#mainMap { height: 500px; }
</style>
