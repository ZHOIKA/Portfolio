const bootLines = [
  '[ OK ] kernel initialized',
  '[ OK ] loading visual modules',
  '[ OK ] mounting portfolio data',
  '[ OK ] security layer active',
  '[ OK ] welcome, guest'
];

const boot = document.getElementById('boot');
const bootLog = document.getElementById('bootLog');

let bootIndex = 0;
function runBoot() {
  if (!boot || !bootLog) return;
  if (bootIndex < bootLines.length) {
    const line = document.createElement('div');
    line.textContent = bootLines[bootIndex];
    bootLog.appendChild(line);
    bootIndex += 1;
    setTimeout(runBoot, 150);
  } else {
    setTimeout(() => {
      if (window.gsap) {
        gsap.to(boot, {
          opacity: 0,
          duration: .55,
          ease: 'power2.out',
          onComplete: () => {
            boot.style.display = 'none';
            startRevealAnimations();
          }
        });
      } else {
        boot.style.display = 'none';
        document.querySelectorAll('.reveal').forEach(el => {
          el.style.opacity = 1;
          el.style.transform = 'none';
        });
      }
    }, 350);
  }
}
runBoot();

function startRevealAnimations() {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.hero .reveal', {
    opacity: 1,
    y: 0,
    duration: .9,
    stagger: .12,
    ease: 'power3.out'
  });

  document.querySelectorAll('.section:not(.hero) .reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: .8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true
      }
    });
  });

  gsap.to('.hero-art img', {
    y: -12,
    duration: 2.7,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

const heroTerminal = document.getElementById('heroTerminal');
const terminalLines = [
  '<span class="prompt">guest@zhoika</span>:<span class="term-key">~</span>$ whoami',
  'Davi Gomes // ZHOIKA',
  '<span class="prompt">guest@zhoika</span>:<span class="term-key">~</span>$ cat focus.txt',
  'cybersecurity · code · creative tech',
  '<span class="prompt">guest@zhoika</span>:<span class="term-key">~</span>$ <span class="cursor-blink"></span>'
];

function renderTerminal() {
  if (!heroTerminal) return;
  heroTerminal.innerHTML = '';
  terminalLines.forEach((text, i) => {
    const row = document.createElement('div');
    row.innerHTML = text;
    row.style.opacity = '0';
    heroTerminal.appendChild(row);
    setTimeout(() => {
      row.style.transition = 'opacity .25s ease';
      row.style.opacity = '1';
    }, 950 + i * 300);
  });
}
renderTerminal();

const skillCommands = [
  ['$ stack --languages', 'Python / Java / JavaScript'],
  ['$ stack --systems', 'Linux / Git / Android'],
  ['$ stack --security', 'Web Security / OSINT / Networking'],
  ['$ stack --frontend', 'HTML / CSS / Tailwind'],
  ['$ status --mindset', 'learning_always']
];
const skillsTerminal = document.getElementById('skillsTerminal');
if (skillsTerminal) {
  skillCommands.forEach(([cmd, val]) => {
    const line = document.createElement('div');
    line.className = 'skill-line';
    line.innerHTML = `<span class="cmd">${cmd}</span><br><span class="val">↳ ${val}</span>`;
    skillsTerminal.appendChild(line);
  });
}

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
if (dot && ring && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate(${e.clientX - 2.5}px, ${e.clientY - 2.5}px)`;
    ring.animate({ transform: `translate(${e.clientX - 17}px, ${e.clientY - 17}px)` }, {
      duration: 180,
      fill: 'forwards'
    });
  });

  document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#$%';
document.querySelectorAll('.scramble').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const original = el.dataset.text || el.textContent;
    let iteration = 0;
    const interval = setInterval(() => {
      el.textContent = original.split('').map((char, index) => {
        if (index < iteration) return original[index];
        return letters[Math.floor(Math.random() * letters.length)];
      }).join('');
      if (iteration >= original.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 35);
  });
});

const magneticEls = document.querySelectorAll('.magnetic');
magneticEls.forEach(el => {
  el.addEventListener('mousemove', e => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * .08}px, ${y * .08}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

function updateClock() {
  const clock = document.getElementById('clock');
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString('pt-BR', { hour12: false });
}
updateClock();
setInterval(updateClock, 1000);

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? '#fff' : '';
    });
  });
}, { threshold: .45 });
sections.forEach(section => observer.observe(section));
