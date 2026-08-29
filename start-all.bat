@echo off
title CareSync Hospital Management System Launcher
echo ========================================================
echo  CareSync Hospital Management System
echo  Launching Java JDBC Backend and React Frontend UI...
echo ========================================================

start "CareSync HMS Backend (8080)" cmd /c "%~dp0run-backend.bat"
timeout /t 3 /nobreak >nul
start "CareSync HMS Frontend (5173)" cmd /c "%~dp0run-frontend.bat"

echo.
echo Launching your browser to http://localhost:5173 ...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo System started successfully!
pause
