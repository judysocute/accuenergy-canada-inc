<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchAddressListByString } from "@/utils/Location";
import { type Nominatim }from "@/types";
let searchingInput = ref("");

const emit = defineEmits<{(e: "getSuggestList", suggestList: Nominatim[]): void}>();
const loading = ref(false);

async function fetchAddressSuggestList(keyWord: string) {
  loading.value = true;
  
  const suggestList = await searchAddressListByString(keyWord);
  loading.value = false;
  emit("getSuggestList", suggestList);
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
  <v-text-field
    v-model="searchingInput"
    label="Start your search"
    :loading="loading"
    placeholder="Start your search"
    @keyup="keyupHandler"
  >
  </v-text-field>
  <!-- <v-text-field
    label="Start your search"
    v-model="searchingInput"
    @keyup="keyupHandler"
  /> -->
</template>

<style></style>