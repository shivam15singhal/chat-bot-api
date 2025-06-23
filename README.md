# 🧠 Chatbot API Backend

A RESTful backend API built using **Node.js**, **Express**, and **MongoDB** to support user-to-user chatbot conversations. Includes features like JWT authentication, role-based access, real-time WebSocket messaging, full CRUD for conversations and messages, and API documentation.

---

## 🚀 Features

- ✅ User registration & login (JWT-based)
- 🧑‍🤝‍🧑 User-to-user conversation creation
- 💬 Full CRUD for messages
- 🔍 Pagination, filtering & full-text search
- 🔐 Role-based access control (User/Admin)
- ⚡ Real-time messaging via WebSocket (Socket.io)
- 📄 Swagger API documentation
- 🧪 Postman collection for testing

---

## 🧰 Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **JWT** for authentication
- **Socket.io** for WebSocket integration
- **Swagger** (OpenAPI) for documentation
- **Postman** for API testing

---

## 📁 Folder Structure


├── config/ # MongoDB and socket setup
├── controllers/ # Controller logic
├── middleware/ # Auth, rate limiter, error handling
├── models/ # Mongoose schemas
├── routes/ # Route handlers
├── docs/ # Swagger YAML file
├── .env.example # Sample env config
├── swagger.yaml # Swagger docs
├── postman_collection.json
├── index.js / server.js # App entry point
└── README.md
