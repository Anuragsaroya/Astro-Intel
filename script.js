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

const heroCard = document.querySelector('.orbit-card');
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
