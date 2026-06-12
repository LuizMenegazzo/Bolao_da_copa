$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $root "data\server.pid"

if (-not (Test-Path -LiteralPath $pidFile)) {
  Write-Host "Nenhum servidor do bolão foi iniciado por este launcher."
  exit 0
}

$serverPid = Get-Content -LiteralPath $pidFile -ErrorAction Stop
$process = Get-Process -Id $serverPid -ErrorAction SilentlyContinue

if ($process) {
  Stop-Process -Id $serverPid -Force
  Write-Host "Servidor do bolão fechado."
} else {
  Write-Host "O servidor do bolão já estava fechado."
}

Remove-Item -LiteralPath $pidFile -Force
