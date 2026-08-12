# ============================================================
# Quick Start Script — Assignment System
# Run from D:\onoRokom\
# ============================================================

# Start Backend (in a new window)
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    Set-Location 'D:\onoRokom\backend\AssignmentSystem'
    `$env:ASPNETCORE_ENVIRONMENT = 'Development'
    Write-Host '=== Backend API ===' -ForegroundColor Cyan
    Write-Host 'Swagger: http://localhost:5000/swagger' -ForegroundColor Green
    dotnet run
"@

# Start Frontend (in a new window)
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    Set-Location 'D:\onoRokom\frontend'
    Write-Host '=== Frontend ===' -ForegroundColor Cyan
    Write-Host 'App: http://localhost:3000' -ForegroundColor Green
    npm run dev
"@

Write-Host "Started both services!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000/swagger" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
