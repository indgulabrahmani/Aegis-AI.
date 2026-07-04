# Aegis Backend - FastAPI

Production-ready FastAPI backend for Aegis AI CEO Assistant with JWT authentication, PostgreSQL database, Gemini AI integration, and WebSocket support.

## Features

- **JWT Authentication**: Secure signup, login, and protected routes
- **AI Orchestrator**: Analyzes founder missions and breaks them into tasks
- **4 Specialist Agents**: HR, Finance, Legal, Marketing with Gemini AI integration
- **Approval Workflow**: High-stakes tasks require founder approval
- **Real-time Updates**: WebSocket support for live progress tracking
- **Comprehensive Logging**: All agent actions are logged for audit trails
- **Analytics**: Track missions, tasks, approval rates, and performance metrics

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Relational database with SQLAlchemy ORM
- **Gemini AI**: Google's generative AI for agent intelligence
- **JWT**: Token-based authentication
- **WebSocket**: Real-time bidirectional communication
- **Async/Await**: Full async support for high performance

## Project Structure

```
backend/
├── app/
│   ├── api/              # API route handlers
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── missions.py   # Mission management
│   │   ├── approvals.py  # Approval workflow
│   │   ├── agents.py     # Agent information
│   │   ├── logs.py       # Audit logs
│   │   ├── analytics.py  # Analytics endpoints
│   │   └── websocket.py  # WebSocket handler
│   ├── core/             # Core functionality
│   │   ├── database.py   # Database connection
│   │   ├── security.py   # JWT and password hashing
│   │   └── deps.py       # Dependency injection
│   ├── models/           # Database models
│   │   ├── database.py   # SQLAlchemy models
│   │   └── schemas.py    # Pydantic schemas
│   ├── services/         # Business logic
│   │   ├── gemini_service.py  # Gemini API integration
│   │   ├── orchestrator.py    # Mission analysis
│   │   └── agents.py          # Agent execution
│   ├── config.py         # Configuration
│   └── main.py           # Application entry point
├── init_db.py            # Database initialization
├── requirements.txt      # Python dependencies
└── .env.example          # Environment variables template
```

## Setup Instructions

### Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Gemini API Key

### Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/aegis
   SECRET_KEY=your-secret-key-here-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb aegis
   
   # Or use psql
   psql -U postgres
   CREATE DATABASE aegis;
   ```

6. **Initialize database**
   ```bash
   python init_db.py
   ```
   
   This creates tables and a default admin user:
   - Email: `admin@aegis.ai`
   - Password: `admin123`

7. **Run the server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user info

### Missions
- `POST /api/missions/` - Create new mission
- `GET /api/missions/` - Get all missions
- `GET /api/missions/{mission_id}` - Get specific mission
- `GET /api/missions/{mission_id}/tasks` - Get mission tasks

### Approvals
- `POST /api/approvals/` - Approve/reject task
- `GET /api/approvals/pending` - Get pending approvals
- `GET /api/approvals/history` - Get approval history

### Agents
- `GET /api/agents/` - Get all agents info
- `GET /api/agents/{agent_id}` - Get specific agent info

### Logs
- `GET /api/logs/` - Get audit logs
- `GET /api/logs/{log_id}` - Get specific log entry

### Analytics
- `GET /api/analytics/` - Get analytics data

### WebSocket
- `WS /api/ws` - Real-time updates (requires token in query param)

## Agent System

### Orchestrator
Analyzes founder missions and breaks them into tasks for specialist agents.

### Specialist Agents
- **HR Agent**: Hiring, job descriptions, onboarding
- **Finance Agent**: Budgets, runway, financial analysis
- **Legal Agent**: Contracts, compliance, legal documents
- **Marketing Agent**: GTM strategy, positioning, campaigns

Each agent uses Gemini AI with specialized system prompts for domain-specific outputs.

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Protected Routes**: All endpoints (except auth) require valid token
- **Approval Gates**: High-stakes actions require founder approval
- **Audit Logging**: All actions logged for compliance

## Database Schema

### Users
- id, email, full_name, hashed_password, is_active, created_at

### Missions
- id, founder_goal, status, created_at, founder_id

### Tasks
- id, mission_id, agent, description, output, artifact_type, requires_approval, approval_status, status, started_at, completed_at

### Approvals
- id, task_id, approved, comment, created_at

### Logs
- id, timestamp, actor, action, mission_id, task_id, details

## Development

### Run with auto-reload
```bash
uvicorn app.main:app --reload
```

### Run tests (when implemented)
```bash
pytest
```

### Database migrations (when using Alembic)
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Production Deployment

1. **Set strong SECRET_KEY** in environment variables
2. **Use production database** (not localhost)
3. **Enable HTTPS** with a reverse proxy (nginx)
4. **Set up process manager** (systemd, supervisor)
5. **Configure CORS** for your frontend domain
6. **Enable rate limiting** (consider adding slowapi)
7. **Set up monitoring** (Sentry, Prometheus)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | Required |
| SECRET_KEY | JWT secret key | Required |
| ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration time | 30 |
| GEMINI_API_KEY | Google Gemini API key | Required |

## Troubleshooting

### Database connection errors
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Gemini API errors
- Verify GEMINI_API_KEY is valid
- Check API quota limits
- Ensure network connectivity

### Import errors
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

## License

Proprietary - All rights reserved
