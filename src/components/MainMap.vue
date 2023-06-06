<script setup lang="ts">
import L, { Marker, type LatLngExpression, LatLng } from "leaflet";
import { onMounted, reactive, watch } from "vue";
import { generateMainMarker, generateGeneralMarker, convertToAddressLevelNumber } from "@/utils/LeafletMap";
import { type Nominatim }from "@/types";

let mainMap: L.Map;

type MarkerGroup = {
  mainLocation?: Nominatim,
  checkedLocations?: Nominatim[],
}

const props = defineProps<MarkerGroup>();

let currentMainMarker: Marker;
let currentSelectedMarker: Marker[] = [];
// const markerGroup: MarkerGroup = reactive({});

// const emit = defineEmits<{
//   (e: "setMainMarker", address: LatLngExpression, markerTitle: string): void,
//   (e: "setGeneralMarker", address: LatLngExpression, markerTitle: string): void,
// }>();

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
});

watch(() => props.mainLocation, (newLocation, oldLocation) => {
  console.log("main", newLocation);
  if (newLocation) {
    const { lat, lon } = newLocation;
    currentMainMarker?.remove();

    const newMarker = generateMainMarker(new LatLng(+lat, +lon), newLocation.display_name);
    newMarker.addTo(mainMap);
    currentMainMarker = newMarker;

    mainMap.setView(newMarker.getLatLng(), convertToAddressLevelNumber(newLocation.type));
  } else {
    currentMainMarker.remove();
  }
});

function addMarkerByDiff(newChecked: Nominatim[] = [], oldChecked: Nominatim[] = []) {
  const newCheckedIds = newChecked.map(item => item.place_id);
  const oldCheckedIds = oldChecked.map(item => item.place_id);
  const toAddId = newCheckedIds.filter(id => !oldCheckedIds.includes(id))[0] || 0;

  const toAddItem = newChecked.find(item => item.place_id === toAddId);
  if (toAddItem) {
    const { lat, lon } = toAddItem;

    const newMarker = generateGeneralMarker(new LatLng(+lat, +lon), toAddItem.display_name);
    currentSelectedMarker.push(newMarker);
    newMarker.addTo(mainMap);
  }
}


function removeMarkerByDiff(newChecked: Nominatim[] = [], oldChecked: Nominatim[] = []) {
  const newCheckedIds = newChecked.map(item => item.place_id);
  const oldCheckedIds = oldChecked.map(item => item.place_id);
  const toRemoveId = oldCheckedIds.filter(id => !newCheckedIds.includes(id))[0] || 0;
  const toRemoveItem = oldChecked.find(item => item.place_id === toRemoveId);
  if (toRemoveItem) {
    const { lat, lon } = toRemoveItem;
    const toRemoveMarker = currentSelectedMarker.find(marker => marker.getLatLng().equals(new LatLng(+lat, +lon)))
    currentSelectedMarker = currentSelectedMarker.filter(marker => marker !== toRemoveMarker);
    toRemoveMarker?.remove();
  }
}

function initCheckedLocations() {
  currentSelectedMarker.forEach(marker => { marker.remove() });
  currentSelectedMarker = [];
  mainMap.setView([0, 0], 1);
}

watch(() => props.checkedLocations, (newChecked = [], oldChecked = []) => {
  if (newChecked.length === 0) {
    initCheckedLocations();
    return;
  }
  if (newChecked.length > oldChecked.length) {
    addMarkerByDiff(newChecked, oldChecked);
  } else if (newChecked.length < oldChecked.length) {
    removeMarkerByDiff(newChecked, oldChecked)
  }
});

</script>

<template>
  <div id="mainMap"></div>
</template>

<style scoped>
#mainMap { height: 500px; }
</style>
