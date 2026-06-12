$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 3000
$url = "http://localhost:$port"
$pidFile = Join-Path $root "data\server.pid"
$nodeCandidates = @(
  (Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"),
  "node"
)

function Get-NodePath {
  foreach ($candidate in $nodeCandidates) {
    $command = Get-Command $candidate -ErrorAction SilentlyContinue

    if ($command) {
      return $command.Source
    }
  }

  throw "Node.js não foi encontrado. Instale o Node.js ou rode pelo Codex, que possui um runtime embutido."
}

function Test-ServerPort {
  try {
    $client = New-Object Net.Sockets.TcpClient
    $connection = $client.BeginConnect("127.0.0.1", $port, $null, $null)
    $isConnected = $connection.AsyncWaitHandle.WaitOne(300, $false)

    if ($isConnected) {
      $client.EndConnect($connection)
    }

    $client.Close()
    return $isConnected
  } catch {
    return $false
  }
}

function Wait-Server {
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    if (Test-ServerPort) {
      return
    }

    Start-Sleep -Milliseconds 250
  }

  throw "O servidor não iniciou na porta $port."
}

if (-not (Test-ServerPort)) {
  $nodePath = Get-NodePath
  if (-not $env:ADMIN_PASSWORD) {
    $env:ADMIN_PASSWORD = Read-Host "Senha de administrador para esta sessao"
  }
  $process = Start-Process -FilePath $nodePath -ArgumentList "server.js" -WorkingDirectory $root -WindowStyle Hidden -PassThru
  Set-Content -LiteralPath $pidFile -Value $process.Id -Encoding ASCII
  Wait-Server
}

Start-Process $url
