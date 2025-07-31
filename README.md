# 🛠 Fullstack Project — User & Project Management App

A simple full-stack app built with:

- **Backend**: ExpressJS + Prisma + PostgreSQL
- **Frontend**: NextJS + Axios
- **Auth**: JWT & Google OAuth2
- **Role-based access**: User/Admin
- **Deployment**: Local environment (dev-ready)

---

## 📦 Features

- User sign-up / login (JWT)
- Google OAuth login (auto-create user)
- Role-based access control (admin vs. user)
- Full CRUD on projects (create, list, edit, delete)
- Admins can manage all projects
- Users can only manage their own projects
- Responsive frontend with project form and list
- Logout support

---

## 🚀 Installation (Local Dev)

### Backend


cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
cp .env.example .env  # or create your .env manually
npx nodemon

###Frontend


cd frontend
npm install
npm run dev

---

### API Routes

/api/auth/signup
POST – Register with email/password

/api/auth/login
POST – Log in with email/password

/api/auth/google
POST – Log in with Google token

/api/projects
GET – Public list
POST – Create project (auth only)

/api/projects/:id
PUT – Edit (owner or admin)
DELETE – Delete (owner or admin)

