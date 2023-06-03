<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { getCurrentAddress, searchAddressListByString } from "./utils/Location";
import { type Nominatim }from "./types";

let displayAddress = ref("");
let searchingInput = ref("");
let suggestList = reactive<{ value: Nominatim[]}>({ value: [] });

onMounted(() => {
  // L.map()
})

async function fetchAddressSuggestList(keyWord: string) {
  searchAddressListByString(keyWord);
  suggestList.value = await searchAddressListByString(keyWord);
}

function fetchUserLocation(event: MouseEvent) {
  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;
      displayAddress.value = await getCurrentAddress(latitude, longitude);
    },
    error => {
      console.log("error", error);
    }
  )
}

function keyupHandler(e: KeyboardEvent) {
  if (e.key === "Enter") {
    // If a user clicked an "Enter" key.
    const inputBoxString = (e.target as HTMLInputElement).value;
    fetchAddressSuggestList(inputBoxString);
  }
}


// every time user type a new search-string will trigger the watcher to fetch the suggestList
watch(searchingInput, (currString, oldString) => {
  fetchAddressSuggestList(currString);
});

</script>

<template>
  <main>
    <input v-model="searchingInput" @keyup="keyupHandler"/>
    <button @click="fetchUserLocation">Get My Location</button>
    <p>Your location is: {{displayAddress}}</p>
    <ul>
      <li v-for="suggestItem in suggestList.value" :key="suggestItem.place_id">
        {{ suggestItem.display_name }}
      </li>
    </ul>
  </main>
</template>

<style scoped>
</style>
