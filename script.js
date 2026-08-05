const FIXED_CODE = "4555";
const wrapper = document.getElementById('cardWrapper');

let isHovered = false;
let mouseX = 0;
let mouseY = 0;

if (wrapper) {
  wrapper.style.transform = "rotateY(0deg) rotateX(0deg)";

  wrapper.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    mouseX = ((e.clientX - cardCenterX) / (rect.width / 2)) * 7;
    mouseY = ((e.clientY - cardCenterY) / (rect.height / 2)) * 7;

    if (isHovered) {
      requestAnimationFrame(() => {
        wrapper.style.transform = `rotateY(${mouseX}deg) rotateX(${-mouseY}deg)`;
      });
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    isHovered = false;
    wrapper.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

function setAuthMode(formType, mode, clickedBtn) {
  const container = clickedBtn.parentElement;
  container.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  const label = document.getElementById(`${formType}InputLabel`);
  const input = document.getElementById(`${formType}Input`);

  if (!label || !input) return;

  if (mode === 'email') {
    label.innerText = 'Email Address';
    input.type = 'email';
    input.placeholder = 'name@example.com';
  } else {
    label.innerText = 'Phone Number';
    input.type = 'tel';
    input.placeholder = '+92 300 1234567';
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";

  if (isPassword) {
    btn.classList.remove('is-hidden');
  } else {
    btn.classList.add('is-hidden');
  }
}

function switchStep(stepId) {
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  const targetStep = document.getElementById(stepId);
  if (targetStep) {
    targetStep.classList.add('active');
  }
}

// --- BUTTON WHITE BORDER LOOP & REDIRECT LOGIC ---

async function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerText;

  // Start White Line Border Loop Animation
  btn.classList.add('loading-border');
  btn.innerText = "Signing In...";

  // 2.5 Seconds Border Loop Delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  btn.classList.remove('loading-border');
  btn.innerText = originalText;

  // Move to next step or dashboard
  triggerDelayedVerification("Access Granted!", "Welcome back to your dashboard");
}

async function handleSignup(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerText;

  // Start White Line Border Loop Animation
  btn.classList.add('loading-border');
  btn.innerText = "Processing...";

  // 2.5 Seconds Border Loop Delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  btn.classList.remove('loading-border');
  btn.innerText = originalText;

  // Move to Verification step
  switchStep('verifyStep');
}

// OTP Auto Focus Logic
const otpInputsContainer = document.getElementById('otpContainer');
const otpFields = document.querySelectorAll('.otp-field');
const statusScreen = document.getElementById('statusScreen');

otpFields.forEach((field, index) => {
  field.addEventListener('input', (e) => {
    if (e.target.value.length === 1 && index < otpFields.length - 1) {
      otpFields[index + 1].focus();
    }
  });

  field.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpFields[index - 1].focus();
    }
  });
});

// Dynamic Square Rotation & Verification Handler (5.5 Seconds)
async function handleVerifySubmit(e) {
  e.preventDefault();
  
  const enteredCode = Array.from(otpFields).map(input => input.value).join('');
  const errorMsg = document.getElementById('codeError');

  if (enteredCode.length !== 4) {
    if (errorMsg) {
      errorMsg.innerText = "Please enter all 4 digits";
      errorMsg.style.display = 'block';
    }
    return;
  }

  if (errorMsg) errorMsg.style.display = 'none';

  // Step 1: Add 2x2 Grid arrangement & start spin animation
  otpInputsContainer.classList.add('dynamic-format');
  otpFields.forEach(field => field.classList.add('dynamic-spin'));

  // Step 2: Continuous Rotation for 5.5 Seconds
  await new Promise(resolve => setTimeout(resolve, 5500));

  // Step 3: Validate Code
  if (enteredCode === FIXED_CODE) {
    document.getElementById('verifyStepForm').style.display = 'none';
    if (statusScreen) statusScreen.classList.add('active');

    otpFields.forEach(input => input.value = '');
    createBurstEffect();

    await new Promise(resolve => setTimeout(resolve, 2000));
    location.reload(); 
  } else {
    otpInputsContainer.classList.remove('dynamic-format');
    otpFields.forEach(field => field.classList.remove('dynamic-spin'));
    
    if (errorMsg) {
      errorMsg.innerText = "Invalid verification code. Demo code is 4555";
      errorMsg.style.display = 'block';
    }
  }
}

// Global Verification Loader Sequencer
function triggerDelayedVerification(finalTitle, finalSub) {
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  
  const loaderBox = document.getElementById('loaderBox');
  const svgCheck = document.getElementById('svgCheck');
  const radar1 = document.getElementById('radar1');
  const radar2 = document.getElementById('radar2');
  const scannerCore = document.getElementById('scannerCore');
  const statusText = document.getElementById('statusText');
  const statusSub = document.getElementById('statusSub');

  if (loaderBox) loaderBox.style.display = 'block';

  if (statusText) statusText.innerText = "Verifying Credentials...";
  if (statusSub) statusSub.innerText = "Scanning key signature";

  setTimeout(() => {
    if (radar1) radar1.style.display = 'none';
    if (radar2) radar2.style.display = 'none';
    if (scannerCore) scannerCore.style.display = 'none';

    if (svgCheck) svgCheck.classList.add('draw');
    if (statusText) statusText.innerText = finalTitle;
    if (statusSub) statusSub.innerText = finalSub;
    
    createBurstEffect();

    setTimeout(() => {
      location.reload(); 
    }, 2500);
  }, 3000);
}

// Canvas Particle Burst System
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createBurstEffect() {
  if (!canvas || !ctx) return;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const colors = ['#00ffcc', '#ff2a75', '#7928ca', '#ffffff'];

  for (let i = 0; i < 110; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 3;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008
    });
  }
  animateParticles();
}

function animateParticles() {
  if (!ctx || particles.length === 0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;

    ctx.save();
    ctx.globalAlpha = Math.max(p.alpha, 0);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;
    ctx.fill();
    ctx.restore();

    if (p.alpha <= 0) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animateParticles);
}