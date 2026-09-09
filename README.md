# DSA Study Journal

An active-recall study journal and practice tracker built for developers preparing for technical coding interviews. Instead of passively solving problems, DSA Study Journal helps users track solutions by algorithmic patterns, record custom confidence scores, capture edge-case reflections, and monitor mastery progression over time.
---

## Features
* **JWT-Based Authentication:** Secure registration and login workflows with persistent session handling and backend record ownership enforcement.
* **Pattern-Based Problem Queue:** Track coding challenges categorized by core algorithmic patterns (*Two Pointers*, *Sliding Window*, *Dynamic Programming*, *Trees & Graphs*, etc.).
* **Progression System:** Categorize problem mastery using dynamic, color-coded status badges (`Learning`, `Needs Review`, `Mastered`).
* **Attempt History & Reflection Logs:** Log individual practice sessions per problem, including time spent, confidence ratings (1–5), solution code snippets, and active-recall notes.
* **Interactive Modal-Driven UI:** Smooth CRUD workflows utilizing key-based component re-instantiation to eliminate stale state bugs.
* **Rapid Evaluation Seeding:** Integrated CLI database seeder script to instantly populate test data and demo credentials.

---

## Tech Stack
### Backend
* **Language/Framework:** Python 3.10+, Flask
* **Database & ORM:** PostgreSQL, Flask-SQLAlchemy, Flask-Migrate (Alembic)
* **Authentication & Security:** Flask-JWT-Extended, Flask-Bcrypt
* **Serialization & Validation:** Marshmallow
* **Environment Management:** Pipenv

### Frontend
* **Library/Tooling:** React 18, Vite
* **Routing & HTTP:** React Router v6, Axios (with interceptors)
* **Styling & UI:** Tailwind CSS, Lucide React (Icons)

---

## Getting Started
### Prerequisites
* **Python** (v3.10 or higher)
* **Node.js** (v18 or higher) & **npm**
* **PostgreSQL** running locally or via WSL2

---

## Backend Setup (server/)
#### 1. Install dependencies using Pipenv:
```bash
cd server
pipenv install
pipenv shell
```
#### Configure Environment Variables:
##### 2. Create a .env file in the server/ root directory (refer to .env.example):
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_development_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/dsa_study_journal
```
#### 3. Initialize Database & Seed Data:
```bash
flask db upgrade
python seed.py
```
#### 4. Start the Flask Development Server:
```bash
python app.py
```
#### The backend server runs on http://127.0.0.1:5555.
---

## Frontend Setup (client/)
### * Open a new Terminal *
#### 1. Install Node dependencies:
```bash
cd client
npm install
```
#### 2. Configure Frontend Environment:
##### Create a .env file in the client/ root directory (refer to .env.example):
```
VITE_API_BASE_URL=http://localhost:5555/api
```
#### 3. Start the Vite Development Server:
```bash
npm run dev
```
#### The React application runs on http://localhost:5173.
---

## Demo Credentials
#### You can log in immediately using the pre-seeded evaluation account:

- Email: demo@example.com
- Password: password123

## Author
Kenneth Mills

Flatiron School — Software Engineering

September 2026