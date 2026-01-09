# Script de teste local da API em PowerShell

$BASE_URL = "http://localhost:3000"

Write-Host "🧪 Testando Backend JISC" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Health Check
Write-Host "1️⃣ Health Check" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/health" -Method Get
$response.Content | ConvertFrom-Json | ConvertTo-Json
Write-Host ""
Write-Host ""

# Status
Write-Host "2️⃣ Status da Aplicação" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/status" -Method Get
$response.Content | ConvertFrom-Json | ConvertTo-Json
Write-Host ""
Write-Host ""

# Criar usuário
Write-Host "3️⃣ Criar Usuário" -ForegroundColor Yellow
$body = @{
    name = "João Silva"
    email = "joao@example.com"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/users" `
    -Method Post `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $body

$userResponse = $response.Content | ConvertFrom-Json
$userResponse | ConvertTo-Json

# Extrair ID do usuário criado
$USER_ID = $userResponse.data.id
Write-Host "ID do usuário criado: $USER_ID" -ForegroundColor Green
Write-Host ""
Write-Host ""

# Listar usuários
Write-Host "4️⃣ Listar Todos os Usuários" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/api/users" -Method Get
$response.Content | ConvertFrom-Json | ConvertTo-Json
Write-Host ""
Write-Host ""

# Obter usuário específico
Write-Host "5️⃣ Obter Usuário Específico" -ForegroundColor Yellow
if ($USER_ID -and $USER_ID -ne "null") {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/users/$USER_ID" -Method Get
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} else {
    Write-Host "Erro: ID de usuário não obtido" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# Deletar usuário
Write-Host "6️⃣ Deletar Usuário" -ForegroundColor Yellow
if ($USER_ID -and $USER_ID -ne "null") {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/users/$USER_ID" -Method Delete
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} else {
    Write-Host "Erro: ID de usuário não obtido" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Testes concluídos!" -ForegroundColor Green
