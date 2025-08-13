# Libaray-Management-System

A full-stack **Library Management System** built using **React.js** (frontend) and **Node.js + Express.js** (backend).  
It allows users to **sign up, log in, view/manage books, and log out** securely.

---

## 🚀 Features
- **User Authentication** (Sign up, Log in, Logout)
- **Protected Dashboard** (accessible only after login)
- **Book Management** (add, view, update, delete)
- **Responsive UI** built with React.js
- **REST API** using Node.js & Express.js
- **MongoDB Database** for storing users and books

---

## 🛠️ Tech Stack
**Frontend:**
- React.js
- Axios (for API requests)
- React Router (for navigation)
- CSS / Bootstrap / TailwindCSS (customizable styling)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt.js for password hashing

---

## 📂 Folder Structure

library-management-system/

 │

 ├── backend/ # Node.js + Express API
 
 │ ├── models/ # Mongoose schemas

 │ ├── routes/ # API routes

 │ ├── server.js # Main backend file

 │ └── .env # Environment variables
 
 │

 ├── frontend/ # React.js UI

 │ ├── src/

 │ │ ├── pages/ # Login, Signup, Dashboard pages

 │ │ ├── components/ # Reusable UI components

 │ │ ├── App.js # Main React app

 │ │ └── index.js
 │

 ├── README.md # Project documentation

 └── .gitignore

---

## ⚙️ Installation & Setup

1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/library-management-system.git
cd library-management-system
```

2️⃣ Backend Setup
```
cd backend
npm install
Create a .env file inside backend/:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Run the backend server:
npm start
```
3️⃣ Frontend Setup
```
cd ../frontend
npm install
npm start
```

## 🔐 Authentication Flow
Signup: User registers → password is hashed → saved in MongoDB.


Login: User enters credentials → JWT token is generated → stored in localStorage.


Protected Routes: Token is checked before accessing dashboard or book management.


Logout: Token is removed → redirected to login page.


## 👨‍💻 Author
Developed by Mukil S E

GitHub: https://github.com/Mukil2004
