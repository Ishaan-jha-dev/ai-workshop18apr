/* ========================================================
   ZERO VENTURE – AI WORKSHOP Logic
   Modern Pro Implementation
   ======================================================== */

const CONFIG = {
  priceStudent: 49,
  priceRegular: 99,
  upiId: "9532106646@kotak811",
  upiName: "ISHAAN JHA",
  whatsappLink: "https://chat.whatsapp.com/G5lHlU2lQy50X56u7m6J7w",
  whatsappNumber: "8299147213",
  googleForm: "https://docs.google.com/forms/d/e/1FAIpQLScoaNTw7cM9yd5gdW5akzza11Tn0TEBWZy-m94JAvSbO4ew8g/viewform?usp=header",
  adminPass: "admin2025"
};

let currentPrice = CONFIG.priceStudent;
let currentType = "Student";

// ───── INITIALIZATION ─────
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initSeats();
  initHeader();
  
  // Load existing data
  const registrations = JSON.parse(localStorage.getItem('zv_regs') || '[]');
  console.log("System Ready. Active Registrations:", registrations.length);
});

// ───── HEADER ─────
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ───── COUNTDOWN (Target 7:45 PM) ─────
function initCountdown() {
  const target = new Date();
  target.setHours(19, 45, 0, 0);

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = target - now;

    if (distance < 0) {
      document.getElementById("countdown").innerHTML = "CLOSED";
      clearInterval(timer);
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = 
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

// ───── SEATS COUNTER ─────
function initSeats() {
  let initial = 33;
  let max = 50;
  
  const saved = JSON.parse(localStorage.getItem('zv_regs') || '[]');
  let count = initial + saved.length;
  
  document.getElementById('regCount').textContent = count;
  document.getElementById('seatsLeft').textContent = max - count;

  // Fake organic updates
  setInterval(() => {
    if (count < max - 2) {
      if (Math.random() > 0.8) {
        count++;
        document.getElementById('regCount').textContent = count;
        document.getElementById('seatsLeft').textContent = max - count;
      }
    }
  }, 15000);
}

// ───── PAYMENT FLOW ─────
function openPaymentFlow(type) {
  if (type) {
    currentType = type === 'student' ? "Student" : "Regular";
    currentPrice = type === 'student' ? CONFIG.priceStudent : CONFIG.priceRegular;
  }

  document.getElementById('modalPrice').textContent = `₹${currentPrice}`;
  document.getElementById('modalType').textContent = `${currentType} Registration`;
  
  // Generate QR
  const upiLink = `upi://pay?pa=${CONFIG.upiId}&pn=${encodeURI(CONFIG.upiName)}&am=${currentPrice}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}&color=050508`;
  document.getElementById('qrImage').src = qrUrl;

  document.getElementById('paymentModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePaymentFlow() {
  document.getElementById('paymentModal').classList.add('hidden');
  document.body.style.overflow = 'auto';
  // Reset steps
  document.getElementById('step1').classList.remove('hidden');
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step3').classList.add('hidden');
}

function validateAndNext() {
  const utr = document.getElementById('utr').value.trim();
  if (utr.length < 6) {
    document.getElementById('utrError').classList.remove('hidden');
    return;
  }
  
  document.getElementById('utrError').classList.add('hidden');
  
  // Save to local
  const regs = JSON.parse(localStorage.getItem('zv_regs') || '[]');
  const newReg = {
    utr,
    type: currentType,
    price: currentPrice,
    time: new Date().toISOString()
  };
  regs.push(newReg);
  localStorage.setItem('zv_regs', JSON.stringify(regs));

  // Next step
  document.getElementById('step1').classList.add('hidden');
  document.getElementById('step2').classList.remove('hidden');
}

function goToStep3() {
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step3').classList.remove('hidden');
  
  // Confetti
  runConfetti();
}

// ───── UTILS ─────
function runConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '3000';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);
  
  // Simple "Antigravity Fallback" Confetti
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let particles = [];
  for(let i=0; i<100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 6 + 2,
      d: Math.random() * 10,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      tilt: Math.random() * 10 - 5
    });
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r/2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/2);
      ctx.stroke();
      p.y += Math.random() * 3 + 2;
      p.tilt += Math.random() * 2 - 1;
    });
    if(particles[0].y < canvas.height) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}

// ───── ADMIN ─────
function openAdmin() {
  const pass = prompt("Admin Password:");
  if (pass === CONFIG.adminPass) {
    const regs = JSON.parse(localStorage.getItem('zv_regs') || '[]');
    console.table(regs);
    alert(`Total Sales: ₹${regs.reduce((sum, r) => sum + r.price, 0)}\nCheck console for full table.`);
  } else {
    alert("Unauthorized.");
  }
}
