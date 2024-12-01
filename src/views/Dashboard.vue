<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { LottieAnimation } from "lottie-web-vue"
import medio from '@/assets/medio.png';
import critico from '@/assets/critico.png';
import estable from '@/assets/estable.png';
import TrashDeleted from "@/assets/demo/trash-deleted.json";
import TrashAdded from "@/assets/demo/trash-added.json";

const searchQuery = ref('');
const displayModal = ref(false);
const selectedAlert = ref(null);
const alerts = ref([]);
let pollingInterval;
const addedSensors = ref(new Set());
const formData = ref({
    latitude: null,
    longitude: null,
    sensorId: null
});


const containers = ref([]);

const displayDeleteModal = ref(false);
const pinToDelete = ref(null);

const selectedStatus = ref(null);

const statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Crítico', value: 'critico' },
    { label: 'Medio', value: 'medio' },
    { label: 'Estable', value: 'estable' }
];

const startPolling = () => {
    pollingInterval = setInterval(fetchAlerts, 3000);
};

const stopPolling = () => {
    clearInterval(pollingInterval);
};

const saveContainer = async (latitude, longitude, alertId) => {
    try {
        const response = await fetch('https://ecocleantype-ecoclean.up.railway.app/api/containers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lat: latitude,
                lon: longitude,
                alertId: alertId
            })
        });

        if (!response.ok) {
            throw new Error('Error al guardar el contenedor');
        }

        const data = await response.json();
        console.log('Contenedor guardado exitosamente:', data);
    } catch (error) {
        console.error('Error al guardar el contenedor:', error);
    }
};

const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBvqc_86-mUD5tQpgcU_xsYDPWH12xoKGM&callback=initMap`;
            script.async = true;
            script.defer = true;
            window.initMap = () => {
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Error loading Google Maps API'));
            };
            document.head.appendChild(script);
        }
    });
};

window.initMap = (latitude, longitude) => {
    if (latitude == null || longitude == null) {
        console.warn('Las coordenadas iniciales son inválidas. El mapa se centrará en una ubicación predeterminada.');
        latitude = 20.938904976395065;
        longitude = -89.61574872523957;
    }

    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 17
    });

    const center = map.getCenter();
    const pin = new google.maps.Marker({
        position: center,
        map: map
    });

    map.addListener('click', (e) => {
        const clickedLocation = e.latLng;
        formData.value.latitude = clickedLocation.lat();
        formData.value.longitude = clickedLocation.lng();

        displayModal.value = true;
    });

    window.map = map;
};

const confirmDeletePin = (pin, containerId) => {
    pinToDelete.value = { pin, containerId };
    displayDeleteModal.value = true;
};

const showDeleteAnimation = ref(false);
const showAddAnimation = ref(false);

const deleteContainer = async (containerId) => {
    try {
        const response = await fetch(`https://ecocleantype-ecoclean.up.railway.app/api/containers/${containerId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el contenedor');
        }

        console.log('Contenedor eliminado exitosamente');
        showDeleteAnimation.value = true;
        setTimeout(() => {
            showDeleteAnimation.value = false;
            fetchContainers();
            initMap();            
        }, 2000);
    } catch (error) {
        console.error('Error al eliminar el contenedor:', error);
    }
};

const deletePin = () => {
    if (pinToDelete.value) {
        const { pin, containerId } = pinToDelete.value;
        pin.setMap(null);
        displayDeleteModal.value = false;
        pinToDelete.value = null;
        deleteContainer(containerId).then(() => {
            fetchContainers();
            selectedAlert.value = null;
        });
    }
};


const fetchAlerts = async () => {
    try {
        const response = await fetch('https://ecocleantype-ecoclean.up.railway.app/api/alerts');
        const data = await response.json();
        alerts.value = data;
    } catch (error) {
        console.error('Error al obtener las alertas:', error);
    }
};

let markers = ref([]);

const createStyledMarker = (location, iconPath, title) => {
    const marker = new google.maps.Marker({
        position: location,
        map: window.map,
        icon: {
            url: iconPath,
            scaledSize: new google.maps.Size(32, 32),
            labelOrigin: new google.maps.Point(16, 40),
        },
        label: {
            text: title,
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000',
            fontFamily: 'San Francisco, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        title: title,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: "Para eliminar haga click sobre el contenedor",
    });

    marker.addListener('mouseover', () => {
        infoWindow.open(window.map, marker);
    });

    marker.addListener('mouseout', () => {
        infoWindow.close();
    });

    return marker;
};

const fetchContainers = async () => {
    try {
        let url = 'https://ecocleantype-ecoclean.up.railway.app/api/containers';
        if (selectedStatus.value) {
            url += `?status=${selectedStatus.value}`;
        }
        const response = await fetch(url);
        const data = await response.json();

        containers.value = data;

        markers.value.forEach((marker) => {
            marker.setMap(null);
        });
        markers.value = []; 

        data.forEach((container) => {
            if (container.lat != null && container.lon != null) {
                const status = container.alertDetails.status.toLowerCase();

                if (!selectedStatus.value || status === selectedStatus.value) {
                    const location = { lat: container.lat, lng: container.lon };
                    let iconPath;

                    switch (status) {
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

                    const pin = createStyledMarker(location, iconPath);

                    pin.addListener('click', () => confirmDeletePin(pin, container._id));
                    markers.value.push(pin);
                }
            } else {
                console.warn(`Invalid coordinates for container with ID: ${container._id}`);
            }
        });

        console.log('Contenedores cargados exitosamente:', data);
    } catch (error) {
        console.error('Error al obtener los contenedores:', error);
    }
};


const handleSubmit = async () => {
    if (selectedAlert.value && formData.value.latitude && formData.value.longitude) {
        const alert = alerts.value.find((a) => a._id === selectedAlert.value);

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

        const location = { lat: formData.value.latitude, lng: formData.value.longitude };
        const trashPin = createStyledMarker(location, iconPath);

        trashPin.addListener('click', () => confirmDeletePin(trashPin));

        console.log('Formulario enviado con los datos:', formData.value);

        await saveContainer(formData.value.latitude, formData.value.longitude, selectedAlert.value);
        showAddAnimation.value = true;
        setTimeout(() => {
            showAddAnimation.value = false;
            fetchContainers();
        }, 2000);
        displayModal.value = false;
    } else {
        alert('Por favor, selecciona una alerta y una ubicación válida.');
    }
};

const searchPlace = () => {
    const query = searchQuery.value;
    if (!query) return;

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=AIzaSyBvqc_86-mUD5tQpgcU_xsYDPWH12xoKGM`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK' && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                const latitude = location.lat;
                const longitude = location.lng;

                const locationPin = { lat: latitude, lng: longitude };
                window.map.setCenter(locationPin);
                window.map.setZoom(15);

                const pin = new google.maps.Marker({
                    position: locationPin,
                    map: window.map,
                    title: query
                });
            } else {
                alert("No se encontraron resultados para la búsqueda.");
            }
        })
        .catch(error => console.error("Error al buscar el lugar:", error));
};

const zoomToContainer = (container) => {
    const location = { lat: container.lat, lng: container.lon };
    window.map.setCenter(location);
    window.map.setZoom(17);
};

const getIconPath = (status) => {
    switch (status.toLowerCase()) {
        case 'critico':
            return critico;
        case 'medio':
            return medio;
        case 'estable':
        default:
            return estable;
    }
};

onMounted(async () => {
    try {
        await loadGoogleMaps();
        window.initMap(20.938904976395065, -89.61574872523957);
        fetchAlerts();
        fetchContainers();
        startPolling();
    } catch (error) {
        console.error('Error loading Google Maps API:', error);
    }
});

onUnmounted(() => {
    stopPolling();
});

watch(selectedStatus, () => {
    initMap();
    fetchContainers();
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
                <Dropdown v-model="selectedStatus" :options="statusOptions" optionLabel="label" optionValue="value"
                    placeholder="Filtrar por estado" @change="fetchContainers" />
            </div>
            <div id="map" style="width: 100%; height: 400px;"></div>
            <div class="container-list">
                <h2>Contenedores activos</h2>
                <ul>
                    <li v-for="container in containers" :key="container._id">
                        <div @click="zoomToContainer(container)" class="container-info">
                            <img :src="getIconPath(container.alertDetails.status)" alt="status icon" />
                            <span>{{ container.alertDetails.message }}</span>
                        </div>
                        <Button style="max-width: 100px;" @click="zoomToContainer(container)" class="go-to-map-button">Ir al mapa</Button>
                    </li>
                </ul>
            </div>
        </div>

        <Dialog v-model:visible="displayModal" header="Agregar contenedor" :modal="true" :closable="false"
            class="p-fluid" style="width: 350px;">
            <div class="flex flex-col gap-4 w-full">
                <Dropdown v-model="selectedAlert" :options="alerts" optionLabel="message" optionValue="_id"
                    placeholder="Seleccionar..." />
                <Button label="Guardar" @click="handleSubmit" />
                <Button label="Cancelar" @click="() => displayModal = false" style="background-color: #02276E; border: #02276E;"/>
            </div>
        </Dialog>

        <Dialog v-model:visible="displayDeleteModal" header="Eliminar Contenedor" :modal="true" :closable="false"
            class="p-fluid" style="width: 350px;">
            <div class="flex flex-col gap-4 w-full">
                <p>¿Estás seguro de que deseas eliminar este contenedor?</p>
                <Button label="Eliminar" @click="deletePin" />
                <Button label="Cancelar" @click="() => displayDeleteModal = false" style="background-color: #02276E; border: #02276E;" />
            </div>
        </Dialog>
        <div v-if="showDeleteAnimation" class="lottie-container">
            <LottieAnimation 
                :animation-data="TrashDeleted"
                :loop="false"
                :speed="1"
            />
        </div>
        <div v-if="showAddAnimation" class="lottie-container">
            <LottieAnimation 
                :animation-data="TrashAdded"
                :loop="false"
                :speed="1"
            />
        </div>
    </Fluid>
</template>

<style scoped>
    #map {
        width: 100%;
        height: 400px;
        border: solid 1px #ccc;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .container-list {
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .container-list h2 {
        margin-bottom: 16px;
        font-size: 1.5em;
        color: #333;
        font-family: 'San Francisco', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .container-list ul {
        list-style: none;
        padding: 0;
    }
    .container-list li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        border-bottom: 1px solid #eee;
        transition: background 0.3s;
        border-radius: 8px;
    }
    .container-list li:hover {
        background: #f5f5f5;
    }
    .container-list li .container-info {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .container-list li img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
    }
    .container-list li span {
        font-size: 1.2em;
        color: #555;
        font-family: 'San Francisco', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .go-to-map-button {
        border: #02276E;
        background-color: #02276E;
        font-family: 'San Francisco', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .lottie-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        z-index: 1000;
    }
</style>
