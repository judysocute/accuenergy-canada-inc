<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchAddressListByString } from "@/utils/Location";
import { type Nominatim }from "@/types";
let searchingInput = ref("");

const emit = defineEmits<{(e: "getSuggestList", suggestList: Nominatim[]): void}>();

async function fetchAddressSuggestList(keyWord: string) {
  const suggestList = await searchAddressListByString(keyWord);
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
  <input v-model="searchingInput" @keyup="keyupHandler"/>
</template>

<style></style>