@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Abrir Bolao.ps1"
if errorlevel 1 (
  echo.
  echo Nao foi possivel abrir o Bolao da Copa.
  echo Verifique a mensagem acima e tente novamente.
  echo.
  pause
)
