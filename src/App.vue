<script setup lang="ts">

onMounted(() => {
  const updateTooltips = <Function>inject('updateTooltips')
  updateTooltips()
})


</script>

<template>
  <router-view />
  <!-- <router-view v-slot="{ Component, route }">
    <transition name="slide">
      <component :is="Component" :key="route" />
    </transition>
  </router-view>-->
</template>
