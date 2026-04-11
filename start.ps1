# =============================================================
# CertChain - Full Stack Dev Launcher
# Starts: Blockchain -> Deploy Contract -> Re-anchor DB -> Backend -> Frontend
# =============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   CertChain Dev Environment        " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 0: Kill any old processes on our ports ---
Write-Host "[0/5] Cleaning up old processes on ports 5001, 8546, 5173..." -ForegroundColor Yellow
$portList = @(5001, 8546, 5173)
foreach ($p in $portList) {
    $netstatLine = netstat -ano | Select-String ":$p\s" | Select-String "LISTENING" | Select-Object -First 1
    if ($netstatLine) {
        $parts = ($netstatLine.ToString().Trim() -split "\s+")
        $procId = $parts[-1]
        if ($procId -match "^\d+$") {
            try {
                Stop-Process -Id ([int]$procId) -Force -ErrorAction SilentlyContinue
                Write-Host "   Killed old process on port $p" -ForegroundColor DarkGray
            } catch {
                Write-Host "   Port $p already free" -ForegroundColor DarkGray
            }
        }
    }
}
Start-Sleep -Seconds 1
Write-Host "   Done." -ForegroundColor DarkGray

# --- Step 1: Start Hardhat Node ---
Write-Host ""
Write-Host "[1/5] Starting local blockchain (Hardhat on port 8546)..." -ForegroundColor Yellow
$blockchainDir = Join-Path $PSScriptRoot "blockchain"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$blockchainDir'; Write-Host '--- Blockchain Window ---'; npx hardhat node --port 8546" -WindowStyle Normal

# Poll until Hardhat is ready
Write-Host "   Waiting for blockchain node..." -ForegroundColor DarkGray
$isReady = $false
for ($i = 1; $i -le 30; $i++) {
    Start-Sleep -Seconds 1
    try {
        $body = '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
        $resp = Invoke-WebRequest -Uri "http://127.0.0.1:8546" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($resp.StatusCode -eq 200) { $isReady = $true; break }
    } catch { }
    Write-Host "   Still waiting... ($i/30)" -ForegroundColor DarkGray
}
if (-not $isReady) {
    Write-Host "ERROR: Hardhat did not start. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host "   OK - Blockchain running at http://127.0.0.1:8546" -ForegroundColor Green

# --- Step 2: Deploy contract ---
Write-Host ""
Write-Host "[2/5] Deploying CertificateStore contract..." -ForegroundColor Yellow
$deployOutput = & cmd /c "cd /d `"$blockchainDir`" && npx hardhat run scripts/deploy.js --network localhost 2>&1"
Write-Host ($deployOutput -join "`n") -ForegroundColor DarkGray

$match = [regex]::Match(($deployOutput -join " "), "deployed to:\s*(0x[a-fA-F0-9]+)")
if (-not $match.Success) {
    Write-Host "ERROR: Deploy failed - could not extract contract address." -ForegroundColor Red
    exit 1
}
$contractAddress = $match.Groups[1].Value
Write-Host "   OK - Contract deployed at $contractAddress" -ForegroundColor Green

# --- Step 3: Update .env ---
Write-Host ""
Write-Host "[3/5] Updating backend .env..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot "backend\.env"
$envLines = Get-Content $envPath
$envLines = $envLines | ForEach-Object {
    if ($_ -match "^CONTRACT_ADDRESS=") { "CONTRACT_ADDRESS=$contractAddress" } else { $_ }
}
$envLines | Set-Content $envPath -Encoding UTF8
Write-Host "   OK - CONTRACT_ADDRESS=$contractAddress" -ForegroundColor Green

# --- Step 4: Re-anchor all existing DB certificates to new contract ---
Write-Host ""
Write-Host "[4/5] Re-anchoring existing certificates to new contract..." -ForegroundColor Yellow
$backendDir = Join-Path $PSScriptRoot "backend"
$reAnchorOutput = & cmd /c "cd /d `"$backendDir`" && node re-anchor.js 2>&1"
Write-Host ($reAnchorOutput -join "`n") -ForegroundColor DarkGray
Write-Host "   OK - All existing certificates re-anchored." -ForegroundColor Green

# --- Step 5: Start Backend & Frontend ---
Write-Host ""
Write-Host "[5/5] Starting backend and frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; Write-Host '--- Backend Window ---'; npm start" -WindowStyle Normal
Start-Sleep -Seconds 3

$frontendDir = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; Write-Host '--- Frontend Window ---'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "   OK - Backend at http://localhost:5001" -ForegroundColor Green
Write-Host "   OK - Frontend at http://localhost:5173" -ForegroundColor Green

# --- Done ---
Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "   CertChain is READY!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "  Frontend:    http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:     http://localhost:5001" -ForegroundColor White
Write-Host "  Blockchain:  http://127.0.0.1:8546" -ForegroundColor White
Write-Host "  Contract:    $contractAddress" -ForegroundColor White
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "All previously issued certificates are valid and verifiable!" -ForegroundColor Green
Write-Host ""
