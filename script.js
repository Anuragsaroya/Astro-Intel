const counters = document.querySelectorAll('[data-count]');

counters.forEach((element) => {
  const target = Number(element.dataset.count);
  let value = 0;
  const increment = Math.max(1, Math.ceil(target / 50));
  const timer = window.setInterval(() => {
    value = Math.min(value + increment, target);
    element.textContent = `${value}${target === 87 ? '%' : ''}`;
    if (value >= target) window.clearInterval(timer);
  }, 25);
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

const heroCard = document.getElementById('orbitalCard');
if (heroCard) {
  heroCard.addEventListener('pointermove', (event) => {
    const rect = heroCard.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  heroCard.addEventListener('pointerleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

const marsGlobe = document.getElementById('marsGlobe');
if (marsGlobe) {
  const core = marsGlobe.querySelector('.globe-core');
  marsGlobe.addEventListener('pointermove', (event) => {
    const rect = marsGlobe.getBoundingClientRect();
    core.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 18}deg`);
    core.style.setProperty('--tilt-x', `${((event.clientY - rect.top) / rect.height - 0.5) * -18}deg`);
  });
  marsGlobe.addEventListener('pointerleave', () => {
    core.style.setProperty('--tilt-x', '0deg');
    core.style.setProperty('--tilt-y', '0deg');
  });
  marsGlobe.querySelectorAll('.globe-marker').forEach((marker) => {
    marker.addEventListener('click', () => {
      marsGlobe.querySelectorAll('.globe-marker').forEach((item) => item.classList.remove('active'));
      marker.classList.add('active');
    });
  });
}

const sites = {
  'Jezero Crater': { lat: 18.41, lon: 77.69, note: 'Perseverance landing region' },
  'Olympus Mons': { lat: 18.65, lon: -133.8, note: 'Large shield volcano in the Tharsis region' },
  'Valles Marineris': { lat: -13.9, lon: -59.2, note: 'Extensive equatorial canyon system' },
  'Elysium Planitia': { lat: 4.5, lon: 135.9, note: 'InSight landing region' },
};

const routeStart = document.getElementById('routeStart');
const routeEnd = document.getElementById('routeEnd');
const roverSpeed = document.getElementById('roverSpeed');
const speedLabel = document.getElementById('speedLabel');
const routeDistance = document.getElementById('routeDistance');
const routeDuration = document.getElementById('routeDuration');
const routeProfile = document.getElementById('routeProfile');
const plannerMessage = document.getElementById('plannerMessage');
const mapRouteDistance = document.getElementById('mapRouteDistance');
const mapRouteStart = document.getElementById('mapRouteStart');
const mapRouteEnd = document.getElementById('mapRouteEnd');
const mapStatus = document.getElementById('mapStatus');
const mapElement = document.getElementById('marsRouteMap');
let marsMap;
let routeLine;
let siteMarkers = {};

const distanceOnMars = (a, b) => {
  const radians = (degrees) => degrees * Math.PI / 180;
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const deltaLat = lat2 - lat1;
  const deltaLon = radians(b.lon - a.lon);
  const haversine = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  return 3389.5 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

function previewRoute() {
  if (!routeStart || !routeEnd || !roverSpeed) return;
  const startName = routeStart.value;
  const endName = routeEnd.value;
  const start = sites[startName];
  const end = sites[endName];
  if (!start || !end) return;
  if (startName === endName) {
    plannerMessage.textContent = 'Choose two different sites to preview a route.';
    routeDistance.textContent = '—';
    routeDuration.textContent = '—';
    return;
  }

  const km = distanceOnMars(start, end);
  const speed = Number(roverSpeed.value) / 100;
  const hours = km / speed;
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.round((hours % 1) * 60);
  const durationText = days > 0
    ? `${days}d ${remainingHours}h ${minutes}m`
    : `${remainingHours}h ${minutes}m`;

  routeDistance.textContent = `${km.toFixed(1)} km`;
  routeDuration.textContent = durationText;
  routeProfile.textContent = 'Great-circle estimate';
  plannerMessage.textContent = `Preview from ${startName} to ${endName}. Straight-line estimate only; actual rover traverses are longer and terrain dependent.`;
  mapRouteDistance.textContent = `${km.toFixed(1)} km (estimate)`;
  mapRouteStart.textContent = startName;
  mapRouteEnd.textContent = endName;

  if (marsMap && window.L) {
    if (routeLine) marsMap.removeLayer(routeLine);
    routeLine = L.polyline([[start.lat, start.lon], [end.lat, end.lon]], {
      color: '#71d3ff', weight: 4, opacity: 0.95, dashArray: '8 8',
    }).addTo(marsMap).bindPopup(`Illustrative great-circle route · ${km.toFixed(1)} km`);
    marsMap.fitBounds(routeLine.getBounds(), { padding: [36, 36], maxZoom: 4 });
  }
}

if (roverSpeed && speedLabel) {
  const updateSpeedLabel = () => { speedLabel.textContent = `${(Number(roverSpeed.value) / 100).toFixed(2)} km/h`; };
  roverSpeed.addEventListener('input', updateSpeedLabel);
  updateSpeedLabel();
}
document.getElementById('planRoute')?.addEventListener('click', previewRoute);
routeStart?.addEventListener('change', previewRoute);
routeEnd?.addEventListener('change', previewRoute);

if (mapElement) {
  if (window.L) {
    mapElement.innerHTML = '';
    marsMap = L.map(mapElement, { center: [18.4, 77.7], zoom: 2, minZoom: 1, maxZoom: 8, scrollWheelZoom: true });
    L.tileLayer('https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg', {
      minZoom: 0,
      maxZoom: 8,
      attribution: 'Maps, data: NASA/JPL/USGS Mars Trek',
    }).addTo(marsMap);

    const pinIcon = L.divIcon({ className: 'mars-pin-wrap', html: '<span class="mars-pin"></span>', iconSize: [20, 20], iconAnchor: [10, 10] });
    Object.entries(sites).forEach(([name, site]) => {
      siteMarkers[name] = L.marker([site.lat, site.lon], { icon: pinIcon }).addTo(marsMap)
        .bindPopup(`<strong>${name}</strong><br>${site.note}<br><button type="button" class="map-select-site" data-site="${name}">Set as destination</button>`);
      siteMarkers[name].on('popupopen', (event) => {
        const button = event.popup.getElement()?.querySelector('.map-select-site');
        button?.addEventListener('click', () => {
          if (routeEnd) routeEnd.value = name;
          previewRoute();
          marsMap.closePopup();
        }, { once: true });
      });
    });

    L.circle([18.41, 77.69], { radius: 7000, color: '#79e1a5', weight: 1, fillColor: '#79e1a5', fillOpacity: 0.08 })
      .addTo(marsMap).bindPopup('Illustrative site vicinity — not an operational safety boundary');
    mapStatus.textContent = 'NASA Trek tiles';
    window.setTimeout(() => marsMap.invalidateSize(), 100);
    previewRoute();
  } else {
    mapElement.innerHTML = '<div class="map-fallback">Map library did not load. Check your connection and reload to view NASA Mars tiles.</div>';
    mapStatus.textContent = 'Library unavailable';
  }
}

const briefForm = document.getElementById('briefForm');
const formStatus = document.getElementById('formStatus');
if (briefForm && formStatus) {
  briefForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(briefForm);
    formStatus.textContent = `Local draft created for ${formData.get('mission')} with ${formData.get('leader')}. Nothing was sent or saved.`;
    briefForm.reset();
  });
}
