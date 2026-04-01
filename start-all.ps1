Write-Host "Starting Databases (Docker)..." -ForegroundColor Green
docker-compose up -d postgres-products postgres-orders

Start-Sleep -Seconds 3

Write-Host "Starting API Gateway (port 4000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\api-gateway; npx @nestjs/cli start --watch"

Start-Sleep -Seconds 2

Write-Host "Starting Products Service (port 4001)..." -ForegroundColor Green  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\products-service; npx @nestjs/cli start --watch"

Start-Sleep -Seconds 2

Write-Host "Starting Orders Service (port 4002)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\orders-service; npx @nestjs/cli start --watch"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend (port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\frontend; npm run dev"

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "All services starting..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

# Esperar a que los servicios estén listos y abrir navegador
Start-Sleep -Seconds 10

Write-Host "Opening browsers..." -ForegroundColor Green
Start-Process "http://localhost:4000/docs"
Start-Process "http://localhost:4001/docs"
Start-Process "http://localhost:4002/docs"

Write-Host "`nURLs abiertas en navegador:" -ForegroundColor Cyan
Write-Host "- API Gateway: http://localhost:4000/docs" -ForegroundColor Cyan
Write-Host "- Products: http://localhost:4001/docs" -ForegroundColor Cyan
Write-Host "- Orders: http://localhost:4002/docs" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000/login (se abre con Vite)" -ForegroundColor Cyan
