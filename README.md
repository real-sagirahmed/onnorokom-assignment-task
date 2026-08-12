# Assignment & Submission Management System

A role-based school/college web application for evaluating understanding of requirements, system design, API development, frontend implementation, and testing.

## Features

- **Admin**: Manage users, classes, subjects; assign teachers; view all data
- **Teacher**: Create/manage assignments, grade submissions with feedback
- **Student**: View & submit assignments, track grades

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | ASP.NET Core 8 Web API, C# |
| Database | PostgreSQL + Entity Framework Core |
| Auth | JWT Bearer Token + Role-based Authorization |
| Testing | xUnit + Moq |
| API Docs | Swagger / OpenAPI |

## Project Structure

```
onoRokom/
├── backend/        # ASP.NET Core Web API
│   └── AssignmentSystem/
└── frontend/       # Next.js 14 application
    └── src/
```

## Setup Instructions

### ⚡ Quick Start (Windows)

```powershell
# 1. Install PostgreSQL if not installed
winget install PostgreSQL.PostgreSQL.17

# 2. Setup database (creates tables + seed data)
.\setup-db.ps1

# 3. Start both servers at once
.\start.ps1
```

Then open: `http://localhost:3000`

---

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- PostgreSQL 15+

### Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE assignment_system;
```

2. Run migrations:
```bash
cd backend/AssignmentSystem
dotnet ef database update
```

### Backend Setup

```bash
cd backend/AssignmentSystem

# Copy environment config
cp appsettings.Development.json.example appsettings.Development.json
# Edit the connection string and JWT secret

# Run the API
dotnet run
```

API will be available at: `http://localhost:5000`  
Swagger UI: `http://localhost:5000/swagger`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment config
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL

# Run dev server
npm run dev
```

App will be available at: `http://localhost:3000`

### Running Tests

```bash
cd backend/AssignmentSystem.Tests
dotnet test
```

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@school.com | Admin@123 |
| Teacher | teacher@school.com | Teacher@123 |
| Student | student@school.com | Student@123 |

## Assumptions

- A student belongs to one class at a time.
- Teachers can only manage assignments for classes/subjects they are assigned to.
- Students can update their submission before the deadline (if not already graded).
- JWT tokens expire after 7 days.
- Passwords must be at least 8 characters with uppercase, lowercase, and number.

## Known Limitations

- File attachment for submissions is not implemented (text-only answers).
- Email notifications are not implemented.
- No pagination on list endpoints (planned as optional enhancement).
