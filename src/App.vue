<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { type Nominatim }from "./types";

import GetUserAddressButton from "./components/GetUserAddressButton.vue";
import UserSearchBar from "./components/UserSearchBar.vue";

let displayAddress = ref("");
let suggestList = reactive<{ value: Nominatim[]}>({ value: [] });

onMounted(() => {
  // L.map()
})

</script>

<template>
  <main>
    <UserSearchBar @get-suggest-list="(itemList) => suggestList.value = itemList" />
    <GetUserAddressButton @get-address="(address) => displayAddress = address"/>
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
