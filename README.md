# 🧠 BrainVault

**BrainVault** is your personal digital memory vault — a place to quickly save and revisit your favorite links, tweets, videos, and notes.
Think of it as your smarter version of “sending links to yourself” — with search, organization, and collaboration built in.

---

## 🌟 Features

### 🔗 Save & Organize Anything

* Save tweets, YouTube videos, blogs, or notes.
* Each saved post includes:

  * Title
  * Tags
  * Type (e.g., tweet, video, article)
  * URL link

### 💾 Saved Posts Page

* Displays all saved items in a clean card layout.
* Search instantly by title.
* Delete posts safely using confirmation modals.

### 🔍 Smart Search & Filter

* Instant filtering and search.
* Clear and responsive UI for all screen sizes.

### 🧠 Multiple “Brains”

* Switch or import different content spaces.
* Ideal for separating work vs personal collections.

### ⚙️ Authentication

* Google OAuth 2.0 login.
* Username + password authentication.
* Secure sessions with JWT.

### 🎨 Modern UI

* Built with **Framer Motion** for smooth micro-interactions and transitions.

---

## 🧰 Tech Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Frontend         | React, Tailwind CSS, Framer Motion, React Query |
| Data Fetching & State | React-query                                         |
| Backend          | Node.js, Express, MongoDB                       |
| Auth             | OAuth2 (Google) + Local username/password       |
| Database         | MongoDB (Dockerized)                            |
| Deployment       | Docker + Docker Compose                         |

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dhruvinjs/BrainVault.git
cd BrainVault
```

### 2️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=3000
MONGO_URI=mongodb://mongo:27017/brainvault
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

> If you’re running without Docker, replace the Mongo URI with:
>
> ```
> MONGO_URI=mongodb://localhost:27017/brainvault
> ```

---

## 🐳 Run with Docker (Recommended)

### 1. Build and Run

```bash
docker compose up --build
```

### 2. Access the app

* **Backend** → [http://localhost:3000](http://localhost:3000)
* **MongoDB** → running internally on port `27017`

This setup runs both the backend and MongoDB locally — no need to install Mongo manually.

---

## 🧑‍💻 Run Locally (without Docker)

### Install dependencies

```bash
npm install
```

### Start MongoDB manually

Make sure MongoDB is running locally:

```bash
mongod --dbpath ./data/db
```

### Start the app

```bash
npm run dev
```

---

## 🗂 Project Structure

```
/src
  ├── components/
  ├── pages/
  ├── store/
  ├── hooks/
  └── utils/
Dockerfile
docker-compose.yml
.env.example
```

---

## 🚀 Future Enhancements

* Browser extension for quick saving.
* AI-powered content summarization.

---

## 🧑‍🎓 Contributing

Pull requests are welcome!
Please open an issue first to discuss proposed changes.

---

