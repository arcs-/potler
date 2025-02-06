<template>
  <Component
    :is="tag"
    :class="{
      '': indent === 'none',
      'px-container sm:px-container-desktop': indent === 'default',
      'px-container-half sm:px-container-desktop-half': indent === 'half',
      'mx-auto w-full max-w-[68rem] px-container sm:px-container-desktop':
        indent === 'center',
    }"
  >
    <slot />
  </Component>
</template>

<script lang="ts" setup>
interface Props {
  tag?: string
  indent?: 'none' | 'default' | 'half' | 'center'
}
withDefaults(defineProps<Props>(), {
  indent: 'default',
  tag: 'div',
})
</script>
