

import * as THREE from "three";

// Mars location data
const marsLocations = [
    {
        name: "Olympus Mons",
        latitude: "18.65° N",
        longitude: "226.2° E",
        lat: 18.65,
        lon: 226.2,
        info: "Olympus Mons is the largest known volcano in our solar system. It is located in the Tharsis region of Mars."
    },
    {
        name: "Valles Marineris",
        latitude: "13.9° S",
        longitude: "300.8° E",
        lat: -13.9,
        lon: 300.8,
        info: "Valles Marineris is a huge canyon system on Mars. It stretches across a large part of the planet."
    },
    {
        name: "Jezero Crater",
        latitude: "18.41° N",
        longitude: "77.69° E",
        lat: 18.41,
        lon: 77.69,
        info: "Jezero Crater is a location explored by NASA's Perseverance rover. Scientists study it for clues about ancient water and past environments."
    }
];

// Main elements
const container = document.getElementById("mars-container");
const loadingMessage = document.getElementById("loading-message");
const statusMessage = document.getElementById("globe-status");
const infoPanel = document.getElementById("location-info");
const searchInput = document.getElementById("searchMars");
const searchResult = document.getElementById("search-result");

// Three.js scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.z = 6;

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);

container.appendChild(renderer.domElement);

// Mars group
const marsGroup = new THREE.Group();
scene.add(marsGroup);

// Mars sphere
const marsGeometry = new THREE.SphereGeometry(2, 64, 64);

const marsMaterial = new THREE.MeshStandardMaterial({
    color: 0xc65b35,
    roughness: 1
});

const mars = new THREE.Mesh(marsGeometry, marsMaterial);
marsGroup.add(mars);

// Load Mars surface texture
const textureLoader = new THREE.TextureLoader();

textureLoader.load(
    "https://upload.wikimedia.org/wikipedia/commons/4/46/Solarsystemscope_texture_2k_mars.jpg",

    function(texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        marsMaterial.map = texture;
        marsMaterial.color.set(0xffffff);
        marsMaterial.needsUpdate = true;

        loadingMessage.style.display = "none";
        statusMessage.innerText = "Mars surface texture loaded successfully.";
    },

    undefined,

    function() {
        loadingMessage.style.display = "none";
        statusMessage.innerText =
            "3D Mars is ready. Surface texture could not load; showing the basic Mars globe.";
    }
);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 3);
sunlight.position.set(5, 3, 5);
scene.add(sunlight);

// Stars in the background
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < 700; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
    );
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.035
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create location markers
const markerMeshes = [];

function getPosition(lat, lon, radius) {
    const latitude = THREE.MathUtils.degToRad(lat);
    const longitude = THREE.MathUtils.degToRad(lon);

    return new THREE.Vector3(
        -radius * Math.cos(latitude) * Math.sin(longitude),
        radius * Math.sin(latitude),
        radius * Math.cos(latitude) * Math.cos(longitude)
    );
}

marsLocations.forEach((place) => {
    const markerGeometry = new THREE.SphereGeometry(0.055, 20, 20);

    const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });

    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

    marker.position.copy(
        getPosition(place.lat, place.lon, 2.045)
    );

    marker.userData.location = place;

    marsGroup.add(marker);
    markerMeshes.push(marker);
    marker.userData.location = place;
});

// Show location information
function showInfo(place) {
    infoPanel.innerHTML = `
        <h3>${place.name}</h3>
        <p>${place.info}</p>
        <p><strong>Latitude:</strong> ${place.latitude}</p>
        <p><strong>Longitude:</strong> ${place.longitude}</p>
    `;

    searchResult.innerText = "Location found: " + place.name;

    markerMeshes.forEach((marker) => {
        marker.material.color.set(
            marker.userData.location.name === place.name
                ? 0x00ff88
                : 0xffff00
        );
    });
}

// Search location
function searchLocation() {
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
        searchResult.innerText = "Please enter a Mars location.";
        return;
    }

    const place = marsLocations.find((item) =>
        item.name.toLowerCase().includes(query)
    );

    if (place) {
        showInfo(place);
    } else {
        searchResult.innerText =
            "Location not found. Try Olympus Mons, Valles Marineris or Jezero Crater.";
    }
}

document.getElementById("searchButton").addEventListener(
    "click",
    searchLocation
);

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchLocation();
    }
});

// Explore buttons
document.querySelectorAll(".explore-button").forEach((button) => {
    button.addEventListener("click", () => {
        const name = button.dataset.location;

        const place = marsLocations.find(
            (item) => item.name === name
        );

        if (place) {
            showInfo(place);
        }
    });
});

// Click 3D markers
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener("click", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(markerMeshes);

    if (hits.length > 0) {
        showInfo(hits[0].object.userData.location);
    }
});

// Mouse drag rotation
let dragging = false;
let previousX = 0;
let previousY = 0;

renderer.domElement.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;

    renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;

    marsGroup.rotation.y += deltaX * 0.006;
    marsGroup.rotation.x += deltaY * 0.006;

    previousX = event.clientX;
    previousY = event.clientY;
});

renderer.domElement.addEventListener("pointerup", () => {
    dragging = false;
});

renderer.domElement.addEventListener("pointercancel", () => {
    dragging = false;
});

// Zoom using mouse wheel or touchpad
renderer.domElement.addEventListener("wheel", (event) => {
    event.preventDefault();

    camera.position.z += event.deltaY * 0.004;

    camera.position.z = THREE.MathUtils.clamp(
        camera.position.z,
        3.5,
        10
    );
}, { passive: false });

// Animation
function animate() {
    requestAnimationFrame(animate);

    if (!dragging) {
        marsGroup.rotation.y += 0.0015;
    }

    renderer.render(scene, camera);
}

animate();

// Responsive resizing
window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});