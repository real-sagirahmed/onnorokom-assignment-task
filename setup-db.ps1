# ============================================================
# Database Setup Script (Windows PowerShell)
# Run this after PostgreSQL is installed
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "=== Assignment System — Database Setup ===" -ForegroundColor Cyan

# 1. Locate psql
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $psqlPath) {
    # Common PostgreSQL 17 install path
    $psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
}
if (-not (Test-Path $psqlPath)) {
    Write-Error "psql not found. Make sure PostgreSQL is installed and in PATH."
    exit 1
}

Write-Host "`n[1/3] Creating database 'assignment_system'..." -ForegroundColor Yellow
& $psqlPath -U postgres -c "CREATE DATABASE assignment_system;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database may already exist — continuing." -ForegroundColor DarkYellow
}

# 2. Set the connection string env var for EF Core
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Port=5432;Database=assignment_system;Username=postgres;Password=postgres"

Write-Host "`n[2/3] Creating EF Core migration (InitialCreate)..." -ForegroundColor Yellow
Push-Location "backend\AssignmentSystem"
dotnet ef migrations add InitialCreate --output-dir Data/Migrations --no-build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration created." -ForegroundColor Green
} else {
    Write-Host "Migration may already exist — skipping." -ForegroundColor DarkYellow
}

Write-Host "`n[3/3] Applying migration (creating tables + seed data)..." -ForegroundColor Yellow
dotnet ef database update 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Database ready!" -ForegroundColor Green
} else {
    Write-Error "Migration failed. Check your PostgreSQL connection string."
}
Pop-Location

Write-Host "`n=== Done! ===" -ForegroundColor Cyan
Write-Host "Demo credentials:" -ForegroundColor White
Write-Host "  Admin:   admin@school.com   / Admin@123" -ForegroundColor Gray
Write-Host "  Teacher: teacher@school.com / Teacher@123" -ForegroundColor Gray
Write-Host "  Student: student@school.com / Student@123" -ForegroundColor Gray
