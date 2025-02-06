<template>
  <div>
    <Component
      :is="getType(component)"
      v-for="(component, index) in components"
      :key="component.id ?? index"
      v-editor-target="index"
      :data="component"
      :scroll-to-index="index"
      :index="index"
      :prev-component="components[index - 1]?.type"
      :next-component="components[index + 1]?.type"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
type Component = T & {
  id?: string
  type: string
}

defineProps<{
  components: Component[]
}>()

function getType(component: Component) {
  if (!component.type) {
    console.error(
      'ComponentLoader: Could not find component with type of',
      component,
    )
    return null
  }

  return component.type.replaceAll(/_/g, '-')
}
</script>
