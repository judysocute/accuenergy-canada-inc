<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import moment from "moment-timezone";
import { type Nominatim, type GoogleTimeZoneInfo }from "./types";
import "leaflet/dist/leaflet.css"

import MainMap from "@/components/MainMap.vue";
import GetUserAddressButton from "@/components/GetUserAddressButton.vue";
import UserSearchBar from "@/components/UserSearchBar.vue";
import { getTimeZoneFromGoogleApi } from "@/utils/Location";

let timezoneInfo = reactive({
  value: {
    dstOffset: 0,
    rawOffset: 0,
    status: "",
    timeZoneId: "",
    timeZoneName: "",
  }
});
const suggestList = reactive<{ value: Nominatim[]}>({ value: [] });
let mainLocation = reactive<{ value: Nominatim | undefined}>({ value: undefined });
const selectedLocations = reactive<{ value: Nominatim[]}>({ value: [] }); // max 10
const checkedLocations = reactive<{ value: Nominatim[]}>({ value: [] });

// =====================================

function addRecordToSearchedPlaces(locationObj : Nominatim) {
  const noDuplicated = selectedLocations.value.every((item) => {
    // check if selected location is duplicated
    if (item.place_id === locationObj.place_id) {
      return false;
    }
    return true;
  });
  if (noDuplicated) {
    // if no duplicate, add the record to queue
    selectedLocations.value.push(locationObj);
    const currLength = selectedLocations.value.length;
    if (currLength > 10) {
      // if the record queue size is longer than 10
      // We have to splice the first item to the last item subtract 10 in order to keep it 10.

      const removedItem = selectedLocations.value.splice(0, currLength - 10)[0];
      checkedLocations.value = checkedLocations.value.filter(checkedLocation => {
        return checkedLocation.place_id !== removedItem.place_id;
      });
    }
  }
}

async function setDisplayLocation(locationObj: Nominatim) {
  const { lat, lon } = locationObj;
  timezoneInfo.value = await getTimeZoneFromGoogleApi(+lat, +lon);
}

function getUserCurrentLocation(locationObj : Nominatim) {
  mainLocation.value = locationObj;
  setDisplayLocation(locationObj);
}

// // User picked a location from suggest list
function pickLocation(locationObj : Nominatim) {
  mainLocation.value = locationObj;
  setDisplayLocation(locationObj);
  addRecordToSearchedPlaces(locationObj);
}

function removeAllCheckedLocations() {
  selectedLocations.value.length = 0;
  checkedLocations.value.length = 0;
  checkedLocations.value = [ ...checkedLocations.value ];
  mainLocation.value = undefined;
}

// =====================================
const displayTime = computed(() => {
  const { timeZoneId, timeZoneName } = timezoneInfo.value || {};
  return moment().tz(timeZoneId) ?
    `${moment().tz(timeZoneId).format("YYYY-MM-DD LT")} ${timeZoneName}`:
    "";
});

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <UserSearchBar @get-suggest-list="(itemList) => suggestList.value = itemList" />
      </v-col>
      <v-col justify="end" cols="3">
        <GetUserAddressButton
          class="mr-2 mb-2"
          @get-address="(locationObj) => getUserCurrentLocation(locationObj)"
        />
        <v-btn
          width="400"
          variant="tonal"
          color="red"
          @click="removeAllCheckedLocations"
        >
          Remove All Selected
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="ma-2">
      <p v-if="mainLocation.value">Your location is: {{mainLocation.value.display_name}} {{displayTime}}</p>
    </v-row>
    <v-row>
      <v-list lines="two" max-width="500" bg-color="black">
        <v-list-item
          v-for="suggestItem in suggestList.value"
          prepend-icon="mdi-map-marker-outline"
          @click="() => pickLocation(suggestItem)"
          :key="suggestItem.place_id"
          :title="suggestItem.category"
          :subtitle="suggestItem.display_name"
        ></v-list-item>
      </v-list>
    </v-row>
    <v-row>
      <v-col cols=2 v-for="(place, idx) in selectedLocations.value" :key="place.place_id">
        <v-checkbox 
          :value="place"
          v-model="checkedLocations.value"
          :label="place.display_name"
        />
      </v-col>
    </v-row>
    <MainMap :main-location="mainLocation.value" :checked-locations="checkedLocations.value" />
  </v-container>
</template>

<style scoped>
#mainMap { height: 500px; }
</style>
