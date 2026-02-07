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

### Authentication Endpoints

#### `POST /api/users/register/`
Register a new user  
**Request Body:**
```json
{
  "first_name": "string",
  "last_name:"String",
  "email": "string",
  "password": "string",
}



#### `POST /api/users/register/`
Register a new user  
**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password2": "string"
}
   
   
   
