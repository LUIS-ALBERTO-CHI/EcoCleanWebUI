<template>
  <div class="container">
    <Card v-if="isMobileDevice()" style="width: 25rem; overflow: hidden">
      <template #header>
        <img alt="user header" src="@/assets/mapa.jpg" />
      </template>
      <template #title>Mapa</template>
      <template #subtitle>Puedes navegar en el mapa de la UTM</template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <Button label="Ir al mapa" class="w-full" />
        </div>
      </template>
    </Card>

    <div v-else class="map-container">
      <MapComponent />
    </div>
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

export default {
  name: 'HomeView',
  components: {
    MapComponent,
    Card,
    Button
  },
  methods: {
    isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
  }
}
</script>

<style scoped>

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

img {
  width: 100%;
  height: 100%;
}
</style>