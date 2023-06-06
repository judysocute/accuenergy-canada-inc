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
  <main>
    <UserSearchBar @get-suggest-list="(itemList) => suggestList.value = itemList" />
    <GetUserAddressButton @get-address="(locationObj) => getUserCurrentLocation(locationObj)"/>
    <button @click="removeAllCheckedLocations">Remove All Selected</button>
    <p v-if="mainLocation.value">Your location is: {{mainLocation.value.display_name}} {{displayTime}}</p>
    <ul>
      <li
        @click="() => pickLocation(suggestItem)"
        v-for="suggestItem in suggestList.value"
        :key="suggestItem.place_id"
      >
        {{ `${suggestItem.display_name} - ${timezoneInfo.value.timeZoneName}` }}
      </li>
    </ul>
    <hr />
    <ul>
      <li v-for="(place, idx) in selectedLocations.value" :key="place.place_id">
        <input
          :value="place"
          type="checkbox"
          v-model="checkedLocations.value"
        />
        {{ `${idx + 1} - ${place.display_name}`}}
      </li>
    </ul>
    <MainMap :main-location="mainLocation.value" :checked-locations="checkedLocations.value" />
  </main>
</template>

<style scoped>
#mainMap { height: 500px; }
</style>
