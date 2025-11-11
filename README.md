# Grippi - Campaign Analytics Dashboard

This is a full-stack web application built for the Grippi Junior Full-Stack Developer Intern Assignment. It features a React/Next.js frontend, a FastAPI backend, and a PostgreSQL database to display a dashboard of marketing campaign analytics.

**Live Demo** : [(https://grippi-junior.vercel.app)](https://grippi-junior.vercel.app/)

(Note: The backend is hosted on Railway's free tier and may take 30-60 seconds to "wake up" on the first load.)

## Features

* Full-Stack Architecture: Decoupled frontend and backend services.

* Analytics Dashboard: Displays campaign data (Clicks, Cost, Impressions) in a clean, filterable table.

* Dynamic Filtering: Filter campaigns by "Active" or "Paused" status, with stat cards that update in real-time.

* REST API: A Python-based FastAPI backend serves campaign data from a database.

* Cloud Deployment: Frontend deployed on Vercel and backend/database deployed on Railway.

## Tech Stack

This project is a monorepo containing two separate services:

**1. Frontend** (/grippi-frontend)

* Framework: React (Next.js)

* Styling: TailwindCSS

*  UI: lucide-react for icons

*  Hosting: Vercel

**2. Backend** (/grippi-backend)

* Framework: FastAPI (Python)

* Database: PostgreSQL (production) & SQLite (local)

* ORM: SQLAlchemy

* Data Validation: Pydantic

* Hosting: Railway

## How It Works

### Architecture

**1. Vercel (Frontend)**: A user visits the Vercel-hosted Next.js application.

**2.API Request**: The React app makes a fetch request to the backend API endpoint (/campaigns) hosted on Railway.

**3. Railway (Backend)**: The FastAPI server receives the request.

**4. SQLAlchemy (ORM)**: The server queries the PostgreSQL database for all campaign data.

**5. Pydantic (Validation)**: The database models are serialized into clean JSON.

**6. API Response**: The JSON data is sent back to the frontend, which then parses it and renders the dashboard.

### Local Development

This project is set up as a monorepo. To run it locally, you will need to run both the frontend and backend in two separate terminals.

**Prerequisites**

* Node.js (v18+)

* Python (v3.8+)

## 1. Backend (/grippi-backend)
```bash
# Navigate to the backend folder
cd grippi-backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
# This will auto-create and seed a local 'campaigns.db' SQLite file
uvicorn main:app --reload
```

--- 


The backend will be running at http://localhost:8000.

## 2. Frontend (/grippi-frontend)
```bash
# Open a new terminal
# Navigate to the frontend folder
cd grippi-frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

The frontend will be running at http://localhost:3000.
