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

counters.forEach((counter) => animateCounter(counter));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

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
  let currentX = 0;
  let currentY = 0;

  const applyTilt = () => {
    marsGlobe.style.setProperty('--tilt-x', `${currentX}deg`);
    marsGlobe.style.setProperty('--tilt-y', `${currentY}deg`);
  };

  marsGlobe.addEventListener('pointermove', (event) => {
    const rect = marsGlobe.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * -18;

    currentX = offsetY;
    currentY = offsetX;
    applyTilt();
  });

  marsGlobe.addEventListener('pointerleave', () => {
    currentX = 0;
    currentY = 0;
    applyTilt();
  });

  const markers = marsGlobe.querySelectorAll('.globe-marker');
  markers.forEach((marker) => {
    marker.addEventListener('click', () => {
      markers.forEach((item) => item.classList.remove('active'));
      marker.classList.add('active');
    });
  });
}
