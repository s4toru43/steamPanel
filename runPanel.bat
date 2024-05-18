@echo off
cd /d "%~dp0server"
start node index.js
cd /d "%~dp0client"
start npm run dev
