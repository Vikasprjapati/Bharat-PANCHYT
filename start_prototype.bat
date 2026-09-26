@echo off
title BHARAT-PANCHYT - SIH 2026 Prototype
echo =====================================================================
echo  BHARAT-PANCHYT
echo  PEOPLES ACTUALL NEEDS CONNECTED WITH HIGHER EDUCATION YOUTH AND TECH
echo  People -^> AI -^> Research -^> Funding -^> Impact
echo =====================================================================
echo.
echo Starting Backend (FastAPI + SQLite on port 8000)...
start "BHARAT-PANCHYT Backend" cmd /k "cd backend && uvicorn main:app --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend (React + Vite on port 5173)...
start "BHARAT-PANCHYT Frontend" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1 --port 5173"

timeout /t 3 /nobreak >nul

echo.
echo Opening BHARAT-PANCHYT in browser...
start http://127.0.0.1:5173

echo.
echo =====================================================================
echo  Prototype is LIVE!
echo  Frontend: http://127.0.0.1:5173
echo  Backend:  http://127.0.0.1:8000
echo  API Docs: http://127.0.0.1:8000/docs
echo =====================================================================
pause
