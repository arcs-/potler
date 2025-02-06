<template>
  <textarea
    v-if="textarea"
    v-model="model"
    class="w-full rounded-md border-2 border-black p-2"
    :rows="3"
  />
  <input
    v-else
    v-model="model"
    type="text"
    class="w-full rounded-md border-2 border-black p-2"
  />
</template>

<script lang="ts" setup>
defineProps<{
  textarea?: boolean
}>()
const model = defineModel<string>()
</script>
