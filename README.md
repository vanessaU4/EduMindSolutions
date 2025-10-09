# EduMindSolutions - Mental Health Platform

## Description

EduMindSolutions is a comprehensive mental health platform designed specifically for youth aged 13-23. The platform provides clinical assessments, peer support, crisis intervention services, and educational resources to support young people's mental health journey.

# GitHub Repository

GitHub Repo Link : https://github.com/vanessaU4/EduMindSolutions


# How to Set Up the environment and Project

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd eduMindSolutions/backend

# Create virtual environment
python -m venv env

# Activate virtual environment
# Windows:
env\Scripts\activate
# Linux/Mac:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

# Designs 

Link to Figma Mockups: https://www.figma.com/design/zYm7PkNDvAU7U64aMpU4VN/EDUMIND?node-id=0-1&t=87yqO5cAqBvoo5nm-1


Screenshots:
 Database schema: <img width="1251" height="1053" alt="Database schema" src="https://github.com/user-attachments/assets/60a27a4e-357d-41b8-9d7e-5c944822306e" />

app responsiveness: ![responsiveness](https://github.com/user-attachments/assets/468e5451-f84d-4e38-8dd4-d96829e4aba8)


# Deployment plan

During the development phase, the EduMindSolutions app will be hosted locally to allow testing, debugging, and faster iteration. The backend, developed with Django REST Framework, and the frontend, built with React, will run on a local server environment to enable quick updates and testing before public release.

For production, the application will be deployed on Render, which will host both the backend API and the PostgreSQL database, while the frontend will be served from the same platform for simplicity. This setup ensures reliability, scalability, and secure data handling as the project grows.

# Video Demo

link to video demo : https://www.loom.com/share/a08cc459cc874da09e73cc890039f889?sid=65bfb0a4-390a-478f-b6f8-24173011b023





### Key Features

- 🏥 **Clinical Assessments** - Professional mental health evaluations and tracking
- 👥 **Peer Support Community** - Safe spaces for peer-to-peer support and forums
- 🚨 **Crisis Intervention** - 24/7 crisis support and emergency resources
- 📚 **Educational Content** - Mental health resources, articles, and multimedia content
- 🔒 **HIPAA Compliant** - Secure, privacy-focused healthcare platform
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🎯 **Role-Based Access** - Different interfaces for patients and healthcare professionals

## 🏗️ System Architecture

### Backend (Django REST API)
- **Framework**: Django 5.1.7 + Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (development) / PostgreSQL (production)
- **Security**: HIPAA-compliant data handling and encryption

### Frontend (React TypeScript)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.0.4
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: Redux Toolkit + React Query
- **Routing**: React Router DOM

### Key Applications

| Application | Purpose | Features |
|-------------|---------|----------|
| **accounts** | User management | Registration, authentication, role-based access |
| **assessments** | Clinical evaluations | Mental health assessments, progress tracking |
| **community** | Peer support | Forums, chat rooms, peer matching |
| **content** | Educational resources | Articles, videos, audio content |
| **crisis** | Emergency support | Crisis hotlines, emergency contacts |
| **wellness** | Health tracking | Mood tracking, wellness goals |


## 📋 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts/register/` | User registration |
| POST | `/api/accounts/login/` | User login |
| POST | `/api/accounts/token/refresh/` | Refresh JWT token |
| GET | `/api/accounts/users/` | List users |

### Assessment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assessments/reviews/` | List assessments/reviews |
| POST | `/api/assessments/reviews/` | Create new assessment |
| GET | `/api/assessments/reviews/stats/` | Assessment statistics |
| GET | `/api/assessments/my-reviews/` | User's assessments |

### Community Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community/categories/` | Forum categories |
| GET | `/api/community/posts/` | Forum posts |
| POST | `/api/community/posts/` | Create forum post |
| GET | `/api/community/chatrooms/` | Chat rooms |
| GET | `/api/community/peer-support/` | Peer support requests |

### Content Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content/audio/` | Audio content (meditations, etc.) |
| GET | `/api/content/categories/` | Content categories |
| GET | `/api/content/mental-health-resources/` | Mental health resources |

### Crisis Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crisis/hotlines/` | Crisis hotlines |
| GET | `/api/crisis/resources/` | Emergency resources |

### Health Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health/` | Basic health check |
| GET | `/health/detailed/` | Detailed system status |

## 🔐 Authentication & Security

### User Roles

- **Patient**: Youth users (13-23) seeking mental health support
- **Professional**: Licensed healthcare providers and counselors
- **Admin**: System administrators

### Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- HIPAA-compliant data encryption
- Secure session management
- Input validation and sanitization
- CORS protection

### Token Usage

```javascript
// Include JWT token in API requests
headers: {
  'Authorization': 'Bearer ' + accessToken,
  'Content-Type': 'application/json'
}
```

## 🎨 Frontend Features

### User Interface

- **Modern Design**: Clean, accessible interface built with Radix UI
- **Dark/Light Mode**: Theme switching for user preference
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliant

### Key Components

- **Dashboard**: Personalized user dashboard with health metrics
- **Assessment Tools**: Interactive mental health assessments
- **Community Forums**: Peer support and discussion spaces
- **Crisis Support**: Quick access to emergency resources
- **Resource Library**: Educational content and tools

### State Management

```typescript
// Redux store structure
interface RootState {
  auth: AuthState;
  assessments: AssessmentState;
  community: CommunityState;
  content: ContentState;
  wellness: WellnessState;
}
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
python manage.py test
```

### Frontend Testing

```bash
cd frontend
npm run test
```

### Integration Testing

```bash
# Run integration tests
docker-compose -f docker-compose.test.yml up --build
```

## 🐳 Docker Deployment

### Development

```bash
# Start all services
docker-compose up --build

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: localhost:5432
```

### Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose logs -f
```

## 📊 Monitoring & Analytics

### Health Checks

The platform includes comprehensive health monitoring:

```bash
# Check system health
curl http://localhost:8000/health/

# Detailed health report
curl http://localhost:8000/health/detailed/
```

### Metrics Tracked

- User engagement and session duration
- Assessment completion rates
- Community participation metrics
- Crisis intervention response times
- System performance and uptime

## 🔧 Configuration

### Environment Variables

#### Backend (.env)




```bash
# API configuration
VITE_API_BASE_URL=http://localhost:8000/api


# Feature flags
VITE_ENABLE_CRISIS_CHAT=true
VITE_ENABLE_PEER_MATCHING=true

# Analytics
VITE_ANALYTICS_ID=your-analytics-id
```





## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test` and `python manage.py test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- **Backend**: Follow PEP 8 Python style guide
- **Frontend**: ESLint + Prettier configuration
- **Commits**: Conventional commit messages
- **Documentation**: Update README and API docs


## 🆘 Crisis Support

**If you or someone you know is in crisis, please contact:**

- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911

The platform includes built-in crisis intervention tools and direct connections to professional support services.


## 🙏 Acknowledgments

- Mental health professionals who provided clinical guidance
- Youth advisory board for user experience feedback
- Open source community for foundational technologies
- Healthcare compliance experts for security guidance

---
