<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
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
let markerMap: Map<number, Marker> = new Map();
const searchedPlaces = reactive<{ value: Nominatim[]}>({ value: [] });
const checkedPlaces = reactive<{ value: Nominatim[]}>({ value: [] });

onMounted(() => {
  mainMap = L.map("mainMap");
  mainMap.setView([0, 0], 1);
  L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }
  ).addTo(mainMap);
})

function removeMainMarker() {
  if (mainMarker) {
    mainMarker.remove(); // remove the main marker
  }
}

function removeAllMarkers() {
  markerMap.forEach((item, id) => {
    removeMarkerById(id);
  });
  markerMap.clear();
  mainMarker.remove();
}

/**
 * initial map status
 */
function initMap() {
  if (mainMarker) {
    mainMarker.remove(); // remove the main marker
  }
  removeAllMarkers();
  mainMap.setView([0, 0], 1);
}

function addMainMarker(latLng: LatLngExpression, markerTitle: string) {
  removeMainMarker();
  mainMarker = generateMainMarker(latLng, markerTitle);
  mainMarker.addTo(mainMap);
}

function addMarker(markerId: number, latLng: LatLngExpression, markerTitle: string) {
  const marker = generateMainMarker(latLng, markerTitle);
  focusToLocation(latLng);
  markerMap.set(markerId, marker);
  marker.addTo(mainMap);
}

function removeMarkerById(markerId: number) {
  const targetMarker = markerMap.get(markerId);
  targetMarker?.remove();
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

function focusToLocation(latLng: LatLngExpression, type: ADDRESS_LEVEL_STRING = "city") {
  mainMap.setView(latLng, convertToAddressLevelNumber(type));
}

function getUserCurrentLocation(locationObj : Nominatim) {
  const { lat, lon, display_name, type } = locationObj;
  const latLng: LatLngExpression = [+lat, +lon];
  addMainMarker(latLng, display_name);
  focusToLocation(latLng, type);
  displayAddress.value = display_name;
  addRecordToSearchedPlaces(locationObj);
}

// User picked a location from suggest list
function pickLocation(locationObj : Nominatim) {
  const { lat, lon, display_name, type } = locationObj;
  const latLng: LatLngExpression = [+lat, +lon];
  addMainMarker(latLng, display_name);
  focusToLocation(latLng, type);
  displayAddress.value = display_name;
  addRecordToSearchedPlaces(locationObj);
}

function changeCheckedPlaces(e: Event, record: Nominatim) {
  const { lat, lon } = record;
  const latLng: LatLngExpression = [+lat, +lon];
  const isChecked = (e.target as HTMLInputElement).checked;
  if (isChecked) {
    addMarker(record.place_id ,latLng, record.display_name);
  } else {
    removeMarkerById(record.place_id);
  }
}

function removeAllSelected() {
  checkedPlaces.value.length = 0;
  removeAllMarkers();
  initMap();
}

</script>

<template>
  <main>
    <UserSearchBar @get-suggest-list="(itemList) => suggestList.value = itemList" />
    <GetUserAddressButton @get-address="(locationObj) => getUserCurrentLocation(locationObj)"/>
    <button @click="removeAllSelected">Remove All Selected</button>
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
        <input
          :value="place"
          type="checkbox"
          v-model="checkedPlaces.value"
          @change="(e) => changeCheckedPlaces(e, place)"
        />
        {{ place.display_name }}
      </li>
    </ul>
    <div id="mainMap"></div>
  </main>
</template>

<style scoped>
#mainMap { height: 500px; }
</style>
