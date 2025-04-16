
# IEEE Paper Generator

A web application for generating IEEE-formatted academic papers with a React frontend and FastAPI backend.

## Project Structure

- `/src` - Frontend code (React, TypeScript)
- `/backend` - Backend API (FastAPI, Python)

## Getting Started

### Setting up Supabase

This project uses Supabase for authentication and data storage. You'll need to:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Set up authentication (Email/Password)
3. Add the Supabase URL and API key to environment variables

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Set environment variables
# Create a .env file in the backend directory with your Supabase credentials
# SUPABASE_URL=your_supabase_url
# SUPABASE_API_KEY=your_supabase_api_key

# Start the backend server
uvicorn backend.main:app --reload
```

## Features

- User authentication (signup, login, logout)
- IEEE paper generation with customizable sections, tables, and formulas
- PDF download of generated papers

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI, Python, ReportLab (PDF generation)
- **Authentication & Database**: Supabase
