@echo off
echo =====================================================================
echo   SISTEM MONITORING KEHADIRAN CAPSTONE (RFID KTM) - FT UMY
echo =====================================================================
echo.
echo 1. Memulai Backend NestJS di port 3001...
start "Backend API NestJS (Port 3001)" cmd /k "cd backend && npm run start:dev"

echo 2. Memulai Frontend Next.js di port 3000...
start "Frontend Web Next.js (Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo Sistem sedang berjalan!
echo - Frontend Website : http://localhost:3000
echo - Terminal Presensi: http://localhost:3000/terminal
echo - Backend API      : http://localhost:3001
echo.
echo Jendela ini dapat ditutup.
pause

