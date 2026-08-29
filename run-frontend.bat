@echo off
title CareSync HMS - React UI (Port 5173)
echo ========================================================
echo  Starting CareSync Hospital Frontend (React + Vite)
echo ========================================================
cd /d "%~dp0frontend"
npm run dev
pause
