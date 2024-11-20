<script setup>
import { onMounted, ref } from 'vue';
import medio from '@/assets/medio.png';
import critico from '@/assets/critico.png';
import estable from '@/assets/estable.png';

const searchQuery = ref('');
const displayModal = ref(false);
const selectedAlert = ref(null);
const alerts = ref([]);
const addedSensors = ref(new Set());
const formData = ref({
    name: '',
    description: '',
    latitude: null,
    longitude: null,
    sensorId: null
});

window.initMap = (latitude, longitude) => {
    const map = new Microsoft.Maps.Map(document.getElementById('map'), {
        center: new Microsoft.Maps.Location(latitude, longitude),
        zoom: 17
    });

    const center = map.getCenter();
    const pin = new Microsoft.Maps.Pushpin(center, {
        title: 'Estás aquí!'
    });
    map.entities.push(pin);

    Microsoft.Maps.Events.addHandler(map, 'click', (e) => {
        const clickedLocation = e.location;
        formData.value.latitude = clickedLocation.latitude;
        formData.value.longitude = clickedLocation.longitude;

        displayModal.value = true;
    });

    window.map = map;
};

const fetchAlerts = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/alerts');
        const data = await response.json();
        alerts.value = data;
    } catch (error) {
        console.error('Error al obtener las alertas:', error);
    }
};

const handleSubmit = () => {
    if (selectedAlert.value && formData.value.latitude && formData.value.longitude) {
        const alert = alerts.value.find((a) => a._id === selectedAlert.value);

        if (addedSensors.value.has(alert.sensorId)) {
            alert("Este sensor ya tiene un pin en el mapa.");
            return;
        }

        formData.value.sensorId = alert.sensorId;
        addedSensors.value.add(alert.sensorId);

        let iconPath;
        switch (alert.status.toLowerCase()) {
            case 'critico':
                iconPath = critico;
                break;
            case 'medio':
                iconPath = medio;
                break;
            case 'estable':
            default:
                iconPath = estable;
                break;
        }

        const location = new Microsoft.Maps.Location(formData.value.latitude, formData.value.longitude);
        const trashPin = new Microsoft.Maps.Pushpin(location, {
            icon: iconPath,
            title: `Status: ${alert.status}`
        });
        window.map.entities.push(trashPin);

        console.log('Formulario enviado con los datos:', formData.value);

        displayModal.value = false;
    } else {
        alert('Por favor, selecciona una alerta y una ubicación válida.');
    }
};

const searchPlace = () => {
    const query = searchQuery.value;
    if (!query) return;

    fetch(`https://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(query)}&key=AlW3HwGJSLoIKpnAQxpHyuZ-xbceCVrYL0WgboHaiiVWZrreMfk98W-solJgu0uo`)
        .then(response => response.json())
        .then(data => {
            const results = data.resourceSets[0]?.resources;
            if (results && results.length > 0) {
                const location = results[0].point.coordinates;
                const latitude = location[0];
                const longitude = location[1];

                const locationPin = new Microsoft.Maps.Location(latitude, longitude);
                window.map.setView({ center: locationPin, zoom: 15 });

                const pin = new Microsoft.Maps.Pushpin(locationPin, {
                    title: query
                });
                window.map.entities.push(pin);
            } else {
                alert("No se encontraron resultados para la búsqueda.");
            }
        })
        .catch(error => console.error("Error al buscar el lugar:", error));
};

onMounted(() => {
    fetchAlerts();

    window.initMap(20.938904976395065, -89.61574872523957);
});
</script>

<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <div class="flex flex-col md:flex-row gap-4">
                <InputGroup>
                    <Button @click="searchPlace" class="md:w-auto">Buscar</Button>
                    <InputText v-model="searchQuery" id="searchBox" placeholder="Ingrese una ubicación" />
                </InputGroup>
            </div>
            <div id="map" style="width: 100%; height: 400px;"></div>
        </div>

        <Dialog v-model:visible="displayModal" header="Agregar contenedor" :modal="true" :closable="true" class="p-fluid w-1/2">
            <div class="flex flex-col gap-4 w-full">
                <label for="alert">Selecciona una alerta:</label>
                <Dropdown v-model="selectedAlert" :options="alerts" optionLabel="message" optionValue="_id" placeholder="Seleccionar alerta" />
                
                <Button label="Guardar" @click="handleSubmit" />
            </div>
        </Dialog>
    </Fluid>
</template>

<style scoped>
    #map {
        width: 100%;
        height: 400px;
        border: solid 1px #ccc;
    }
</style>
