const counters = document.querySelectorAll('[data-count]');

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  let value = 0;
  const increment = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    value += increment;
    if (value >= target) {
      value = target;
      clearInterval(timer);
    }
    element.textContent = `${value}${target === 87 ? '%' : ''}`;
  }, 25);
};
counters.forEach(animateCounter);

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
    const tiltY = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const tiltX = ((event.clientY - rect.top) / rect.height - 0.5) * -18;
    core.style.setProperty('--tilt-x', `${tiltX}deg`);
    core.style.setProperty('--tilt-y', `${tiltY}deg`);
  });
  marsGlobe.addEventListener('pointerleave', () => {
    core.style.setProperty('--tilt-x', '0deg');
    core.style.setProperty('--tilt-y', '0deg');
  });
  const markers = marsGlobe.querySelectorAll('.globe-marker');
  markers.forEach((marker) => marker.addEventListener('click', () => {
    markers.forEach((item) => item.classList.remove('active'));
    marker.classList.add('active');
  }));
}

const routeMapElement = document.getElementById('marsRouteMap');
if (routeMapElement) {
  if (window.L) {
    routeMapElement.innerHTML = '';

    // NASA/JPL/USGS Mars Trek public MOLA color hillshade tiles.
    const marsMap = L.map(routeMapElement, {
      center: [18.4, 77.7],
      zoom: 2,
      minZoom: 1,
      maxZoom: 8,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    L.tileLayer(
      'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
      {
        minZoom: 0,
        maxZoom: 8,
        attribution: 'Maps, data: NASA/JPL/USGS Mars Trek',
        errorTileUrl: '',
      },
    ).addTo(marsMap);

    const locations = [
      { name: 'Jezero Crater', lat: 18.41, lon: 77.69, note: 'Perseverance landing site · planned traverse' },
      { name: 'Olympus Mons', lat: 18.65, lon: -133.8, note: 'Largest known volcano in the solar system' },
      { name: 'Valles Marineris', lat: -13.9, lon: -59.2, note: 'Extensive canyon system' },
      { name: 'Elysium Planitia', lat: 4.5, lon: 135.9, note: 'InSight landing region' },
    ];

    const pinIcon = L.divIcon({
      className: 'mars-pin-wrap',
      html: '<span class="mars-pin"></span>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    locations.forEach((site) => {
      L.marker([site.lat, site.lon], { icon: pinIcon })
        .addTo(marsMap)
        .bindPopup(`<strong>${site.name}</strong><br>${site.note}`);
    });

    const traverse = [
      [18.41, 77.69],
      [18.55, 77.95],
      [18.72, 78.25],
      [18.88, 78.52],
    ];
    L.polyline(traverse, {
      color: '#71d3ff',
      weight: 4,
      opacity: 0.9,
      dashArray: '8 8',
      className: 'mars-route-line',
    }).addTo(marsMap).bindPopup('Planned Jezero traverse · 4.8 km');

    L.circle([18.41, 77.69], {
      radius: 7000,
      color: '#79e1a5',
      weight: 1,
      fillColor: '#79e1a5',
      fillOpacity: 0.08,
    }).addTo(marsMap).bindPopup('Mission operations zone');

    window.setTimeout(() => marsMap.invalidateSize(), 100);
  } else {
    routeMapElement.innerHTML = '<div class="map-fallback">Map library did not load. Check your connection and reload to view NASA Mars tiles.</div>';
  }
}

const briefForm = document.getElementById('briefForm');
const formStatus = document.getElementById('formStatus');
if (briefForm && formStatus) {
  briefForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(briefForm);
    const mission = formData.get('mission') || 'Mission';
    const leader = formData.get('leader') || 'Crew lead';
    formStatus.textContent = `Brief queued for ${mission} with ${leader}. Mission control will review the EVA plan.`;
    briefForm.reset();
  });
}
