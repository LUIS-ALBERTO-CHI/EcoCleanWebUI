<template>
    <div class="map-wrapper">
      <div
        class="map-container"
        :style="mapStyle"
        @wheel="handleZoom"
        @click="addPin($event)"
      >
        <img src="@/assets/mapa.jpg" alt="Mapa" class="map-image" />
        <div
          v-for="(pin, index) in pins"
          :key="index"
          class="pin"
          :style="{ top: `${pin.y}px`, left: `${pin.x}px` }"
          @click.stop="removePin(index)"
        >
          <img src="@/assets/basura.png" alt="Trash Icon" class="trash-icon" />
        </div>
      </div>
    </div>
    <div class="zoom-controls">
      <Button @click="zoomIn" icon="pi pi-plus"></Button>
      <Button @click="zoomOut" icon="pi pi-minus"></Button>
    </div>
  </template>
  
  <script>
  import Button from 'primevue/button';
  export default {
    components: {
      Button
    },
    data() {
      return {
        scale: 1,
        pins: []
      };
    },
    computed: {
      mapStyle() {
        return {
          transform: `scale(${this.scale})`,
          transformOrigin: "center center"
        };
      }
    },
    methods: {
      handleZoom(event) {
        const zoomFactor = 0.1;
        if (event.deltaY < 0) {
          this.scale = Math.min(this.scale + zoomFactor, 3);
        } else {
          this.scale = Math.max(this.scale - zoomFactor, 1);
        }
      },
      zoomIn() {
        this.scale = Math.min(this.scale + 0.1, 3);
      },
      zoomOut() {
        this.scale = Math.max(this.scale - 0.1, 1);
      },
      addPin(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / this.scale;
        const y = (event.clientY - rect.top) / this.scale;
        this.pins.push({ x, y });
      },
      removePin(index) {
        this.pins.splice(index, 1);
      }
    }
  };
  </script>
  
  <style scoped>
  .map-wrapper {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 700px;
    border: solid 3px #999999;
    margin-top: 20px;
  }
  
  .map-container {
    position: relative;
    transition: transform 0.3s ease;
  }
  
  .map-image {
    width: 100%;
    height: 700px;
  }
  
  .pin {
    position: absolute;
    transform: translate(-50%, -100%);
    cursor: pointer;
  }
  
  .trash-icon {
    width: 24px;
    height: 24px;
  }
  
  .zoom-controls {
    margin-top: 10px;
  }
  
  .zoom-controls button {
    padding: 5px 10px;
    font-size: 16px;
    margin: 0 5px;
    cursor: pointer;
  }
  </style>
  