const { spawn } = require('child_process');

console.log('=====================================================================');
console.log('  MEMULAI SISTEM MONITORING CAPSTONE (BACKEND + FRONTEND)');
console.log('=====================================================================');
console.log('▶ Backend API NestJS : http://localhost:3001');
console.log('▶ Frontend Next.js   : http://localhost:3000');
console.log('▶ Terminal Presensi  : http://localhost:3000/terminal');
console.log('Tekan Ctrl + C untuk menghentikan kedua layanan.\n');

// 1. Jalankan Backend NestJS
const backend = spawn('npm', ['--prefix', 'backend', 'run', 'start:dev'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Jalankan Frontend Next.js
const frontend = spawn('npm', ['--prefix', 'frontend', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

backend.on('error', (err) => console.error('[Backend Error]:', err));
frontend.on('error', (err) => console.error('[Frontend Error]:', err));

process.on('SIGINT', () => {
  console.log('\nMenghentikan Backend dan Frontend...');
  backend.kill();
  frontend.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

