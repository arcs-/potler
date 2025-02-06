<template>
  <Component
    :is="tag"
    :class="{
      '': indent === 'none',
      'mx-auto w-full max-w-screen-md px-6 md:px-8': indent === 'default',
    }"
  >
    <slot />
  </Component>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  tag?: string
  indent?: 'none' | 'default' | 'small'
}>(), {
  indent: 'default',
  tag: 'div',
})
</script>
