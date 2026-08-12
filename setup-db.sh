# Database Setup Script
# Run this after PostgreSQL is installed

# 1. Create the database
psql -U postgres -c "CREATE DATABASE assignment_system;"

# 2. Apply EF Core migrations (creates all tables + seeds demo data)
cd backend/AssignmentSystem
dotnet ef migrations add InitialCreate --output-dir Data/Migrations
dotnet ef database update
