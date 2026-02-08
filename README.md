# Haraka - Full-Stack Web Application

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/django-4.0%2B-green.svg)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/next.js-13%2B-black.svg)](https://nextjs.org/)

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Design & Mockups](#design--mockups)
- [Deployment](#deployment)
- [Video Demo](#video-demo)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Project Overview

Haraka is a comprehensive full-stack web application designed to provide a seamless user experience with robust authentication and authorization features. This project demonstrates modern web development practices using Django for the backend and Next.js for the frontend, with token-based authentication and responsive design.

**Repository Links:**
- Backend: https://github.com/simplykevine/haraka-backend
- Frontend: https://github.com/simplykevine/haraka-frontend

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 4.0+
- **Database:** PostgreSQL
- **Authentication:** Django REST Framework with Token Authentication
- **Environment:** Python 3.8+

### Frontend
- **Framework:** Next.js 13+
- **Language:** JavaScript/TypeScript
- **Styling:** CSS Modules / Tailwind CSS
- **State Management:** React Context / Redux
- **HTTP Client:** Axios

### Development Tools
- **Version Control:** Git
- **Environment Variables:** .env files
- **API Testing:** Postman

## ✨ Features

### Frontend Features
- **Authentication System:**
  - User registration with form validation
  - Login with token-based authentication
  - Field validation and error handling
  - Edge case management
  - Responsive design for all devices

- **User Interface:**
  - Clean and modern UI design
  - Intuitive navigation
  - Responsive layout
  - Form validation with real-time feedback

### Backend Features
- **RESTful API Endpoints:**
  - `/api/users/` - User management
  - `/api/reviews/` - Review system
  - `/api/agents/` - Agent management
  - `/api/tools/` - Tools management

- **Security:**
  - Token-based authentication
  - Role-based authorization
  - Protected API endpoints
  - Environment variable security

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- Python 3.8+
- PostgreSQL
- Git
- npm or yarn

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/simplykevine/haraka-backend.git
   cd haraka-backend

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt

4. **Configure environment variables:**
 -Create a .env file in the root directory:

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate

6. **Start the development server**
     ```bash
   python manage.py runserver

## Frontend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/simplykevine/haraka-frontend.git
   cd haraka-frontend

2. **Install dependencies**
    ```bash
   npm install
3. **Configure environment variables**
   Create a .env file: 
   ```bash
   BASE_URL=http://localhost:8000/api

4. **Run the development server**
   ```bash
   npm run dev
5. **Open your browser**
    Navigate to
   ```bash
   http://localhost:3000

# Project Structure
## Backend structure

haraka-backend/

├── api/              # Django project settings

├── users/              # User management app

├── reviews/            # Reviews app

├── agents/             # Agents app

├── tools/              # Tools app

├── manage.py

├── requirements.txt

└── .env                # Environment variables

## Frontend structure

haraka-frontend/

├── pages/              # Next.js pages

├── components/         # React components

├── styles/             # CSS styles

├── utils/              # Helper functions

├── api/           # API services

├── public/             # Static assets

├── next.config.js

├── package.json

└── .env         # Environment variables

## 📚 API Documentation
- Access the interactive API documentation:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

| Endpoint         | Method      | Description           | Auth Required |
|------------------|--------     |-------------------|---------------|
| `/api/users/`    | GET/POST    | Get/add users     | ✅Yes         |
| `/api/reviews/`  | GET/POST    | Get/post reviews  | ✅ Yes        |
| `/api/agents/`   | GET/POST    | Get/post agents   | ✅ Yes        |
| `/api/tools/`    | GET/POST    | Get/post tools    | ✅ Yes        |


### Schema relationship

                                    ┌─────────────────────────────────┐
                                    │           USERS                 │
                                    ├─────────────────────────────────┤
                                    │ • user_id (PK)                  │
                                    │ • first_name                    │
                                    │ • last_name                     │
                                    │ • role                          │
                        ┌───────────│ • email                         │
                        │           │ • created_at                    │
                        │           │ • image                         │
                        │           └─────────────────────────────────┘
                        │                         │
                        │                         │ 1:N
                        │                         │
                        │           ┌─────────────▼─────────────────┐
                        │           │      CONVERSATION             │
                        │           ├───────────────────────────────┤
                        │           │ • conversation_id (PK)        │
                        │           │ • user_id (FK)                │
                        │           │ • title                       │
                        │           │ • created_at                  │
                        │           └───────────────────────────────┘
                        │                         │
                        │                         │ 1:N
                        │                         │
                        │           ┌─────────────▼─────────────────┐
                        │           │           RUNS                │
                        │           ├───────────────────────────────┤
                        │           │ • run_id (PK)                 │
                        │           │ • conversation_id (FK)        │
                        │           │ • user_input                  │
                        │           │ • final_output                │
                        │           │ • status                      │
                        │           │ • started_at                  │
                        │           │ • completed_at                │
                        │           └───────────────────────────────┘
                        │                         │
                        │                         │ 1:N
                        │                         │
        ┌───────────────┼───────────┬─────────────▼─────────────────┐
        │               │           │          STEPS                │
        │               │           ├───────────────────────────────┤
        │               │           │ • step_id (PK)                │
        │               │           │ • run_id (FK)                 │
        │               │           │ • step_order                  │
        │               │           │ • type                        │
        │               │           │ • content (JSON)              │
        │               │           │ • tool_id (FK)                │
        │               │           │ • agent_id (FK)               │
        │               │           │ • created_at                  │
        │               │           └───────────┬───────────────────┘
        │               │                       │           │
        │               │                       │ N:1       | N:1
        │               │                       │           │
        │   ┌───────────▼───────────┐  ┌────────▼───────┐   │
        │   │      REVIEWS          │  │     TOOLS      │   │
        │   ├───────────────────────┤  ├────────────────┤   │
        │   │ • review_id (PK)      │  │ • tool_id (PK) │   │
        │   │ • review_text         │  │ • tool_name    │   │
        │   │ • user_id (FK)        │  │ • tool_desc... │   │
        │   │ • rating              │  │ • meta_data    │   │
        │   │ • created_at          │  └────────────────┘   │
        │   └───────────────────────┘                       │
        │                                                   │
        │                                      ┌────────────▼────────┐
        │                                      │      AGENTS         │
        │                                      ├─────────────────────┤
        │                                      │ • agent_id (PK)     │
        │                                      │ • agent_name        │
        │                                      │ • description       │
        │                                      └─────────────────────┘
        │
        │
        │               ┌────────────────────────────┐
        └───────────────│    RAG_EMBEDDINGS          │
                        ├────────────────────────────┤
                        │ • embedding_id (PK)        │
                        │ • content                  │
                        │ • source                   │
                        │ • embedding_vector         │
                        │ • created_at               │
                        └────────────────────────────┘
### 🎨 Design & Mockups

#### Figma Mockups
[Link to Figma design files](https://www.figma.com/proto/eaWZirlhPSEBe5guPj5PbV/zeno-design?node-id=1-2&p=f&t=KPgytJBC2ABEIheA-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2&show-proto-sidebar=1)

#### Screenshots

- Landing page
<img width="5120" height="3328" alt="zeno-chat" src="https://github.com/user-attachments/assets/74923871-21b1-4a2a-8a79-900e4b84da64" />

- Sign up page
<img width="1280" height="824" alt="Eco-Signup" src="https://github.com/user-attachments/assets/1ec3d62a-9f2b-48e1-873b-d18752d105ea" />

- Login Page
<img width="1280" height="824" alt="MacBook Air - 66" src="https://github.com/user-attachments/assets/29afeac8-a7b0-4d7c-b87b-aed1318be370" />


### 🌐 Deployment

#### Backend Deployment (Heroku/Render)
**Prepare for production:**
- Set `DEBUG=False` in settings
- Configure `ALLOWED_HOSTS`
- Set up static files handling

**Deploy to Heroku:**
```bash
heroku create haraka-backend
git push heroku main
heroku run python manage.py migrate
```
#### Frontend Deployment (Vercel/Netlify)
**Build the application:**
```bash
  npm run build
```



**Deploy to Vercel:**
- Configure environment variables:

### Database Migration
- Use PostgreSQL in production
- Configure database URL in environment variables
- Run migrations after deployment

---

### 🎥 Video Demo
[Watch the full demo video (5 minutes)](https://jam.dev/c/46699a62-d218-411e-a85b-deda120dfd56?startFrom=304.53)  

The video demo covers:
- User registration and login process
- Navigation through the application
- API endpoint testing
- Responsive design demonstration
- Authentication and authorization features


### 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Kevine Umutoni**  
- Email: [k.umutoni@alustudent.com](mailto:k.umutoni@alustudent.com)  
- GitHub: [@simplykevine](https://github.com/simplykevine)  
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/umutoni-kevine-aa9a29278/)
