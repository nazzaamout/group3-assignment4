# 🛡️ Secure Message Board Application

This is a secure web-based message board built as part of the **ITSC320 – Software Security** course at **SAIT (Winter 2025)**. The application allows users to register, log in, and post, edit, or delete messages. It is designed with a strong focus on security best practices, including input validation, XSS/CSRF protection, password hashing, and token-based authentication.

---

## 📌 Features

- User Registration and Login
- Secure Password Storage (bcrypt hashing)
- JWT-based Authentication
- View and Post Messages
- Edit/Delete Own Messages
- Auto-refreshing Message Board
- Input Validation and Sanitization (Server + Client)
- XSS and CSRF Protection
- SQL Injection Mitigation
- Role-based Access Control (optional enhancement)
- Secure Logout

---

## 🧱 Tech Stack

### Frontend
- React.js
- Axios
- DOMPurify
- CSS Modules or TailwindCSS

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcrypt
- Helmet
- CSURF

### Database
- MySQL (via MySQL2 or Sequelize with parameterized queries)

---

## 🔐 Security Measures Implemented

- **Input Validation:** Prevents malformed or malicious data on both frontend and backend.
- **XSS Protection:** DOMPurify on the frontend; output encoding on the backend.
- **CSRF Protection:** Managed with CSURF middleware.
- **SQL Injection Protection:** Secure parameterized queries.
- **Authentication:** JWT-based login system with token expiration and secure storage.
- **Password Management:** Enforced password policy; bcrypt hashing.
- **Secure Secrets:** Environment variables managed in `.env`.

---

## 📸 Screenshots

Screenshots included in the final report:
- Login & Registration
- Post a Message
- Edit/Delete Message (own only)
- Authenticated vs Unauthenticated Views
- Browser DevTools (secure headers, tokens)

---

## 🛠️ Setup Instructions

> _Note: Only the report with screenshots is being submitted. Local setup is optional for group members not directly involved in development._

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/secure-message-board.git
cd secure-message-board
```


### 2. Install Dependencies 

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Setup Environment Variables (Backend)

Create a `.env` file inside the `/server` directory: 
```bash
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=secure_board

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h
```

### 4. Start the Servers
```bash
# Start backend
cd server
npm start

# Start frontend
cd ../client
npm run dev
```
---

## 📚 License
This project is part of a SAIT coursework assignment and is not intended for production use.