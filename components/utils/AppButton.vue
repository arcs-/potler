<template>
  <NuxtLink
    v-if="to"
    :to="to"
    v-bind="$attrs"
    :class="btnVariant"
    :target="target || $isExternalUrl(to) ? '_blank' : '_self'"
  >
    <slot />
    <Component :is="'icon-' + icon" v-if="icon" :class="iconClasses" />
  </NuxtLink>
  <button
    v-else
    :class="btnVariant"
    v-bind="$attrs"
    type="button"
  >
    <slot />
    <Component :is="'icon-' + icon" v-if="icon" :class="iconClasses" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  to: {
    type: [String, Object],
    default: null,
  },

  target: {
    type: String,
    default: null,
  },

  icon: {
    type: String,
    default: null,
  },

  iconClasses: {
    type: String,
    default: 'w-5 ml-3',
  },

  variant: {
    type: String,
    default: 'white',
  },
})

const btnVariant = computed(() => {
  const classes = ['flex items-center font-bold transition duration-200']

  if (props.variant === 'primary') {
    classes.push('bg-black hover:bg-gray-300 text-white py-5 px-6 rounded')
  }

  if (props.variant === 'secondary') {
    classes.push('bg-white hover:bg-gray-300 text-black py-5 px-6 rounded')
  }

  if (props.variant === 'outlined') {
    classes.push(
      'rounded border border-black bg-transparent hover:bg-black hover:text-white px-4 py-2 text-black',
    )
  }

  return classes
})
</script>
