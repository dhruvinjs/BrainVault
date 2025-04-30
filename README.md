# 🧠 BrainVault

BrainVault is your personal digital memory vault — a place to quickly paste and store tweets, YouTube videos, articles, or thoughts you want to revisit later. Think of it as your smarter version of sending links to yourself on WhatsApp — but with powerful search, organization, and management features.

---

## 🌟 Features

### 🔗 Save Any Type of Content
- Paste and store links to tweets, YouTube videos, blogs, notes, or any media.
- Each saved item includes:
  - Title
  - Tags
  - Type (e.g., tweet, video, article)
  - Link

### 💾 Saved Posts Page
- View all your saved content in a clean, card-based layout.
- Powerful search by title.
- Delete any saved post with a confirmation modal.
- Responsive design, works across devices.

### 🧠 Load Another Brain
- Import or switch between different "brains" (content spaces).
- Perfect for maintaining separate personal and work memories.

### 🔍 Search & Filter
- Easily search saved items by keywords.
- See filtered results instantly.
- Clear search in one click.

### 🗑️ Safe Deletion with Confirmation
- Prevent accidental deletion with a clean confirmation modal.
- Shows a loading spinner when deleting a post.

---

## 📦 Tech Stack

- **Frontend**: React, Tailwind CSS  
- **Routing**: React Router  
- **Icons**: Lucide React  
- **State Management**: Zustand  
- **Backend** *(optional/assumed)*: Node.js, Express, MongoDB  
- **Utilities**: Custom Modal, Loader, Card, and Button components

---

## 🧪 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/brainvault.git
cd brainvault

```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Project
```bash
npm run dev
```

> Make sure your backend server (if any) is also running to load/post saved content.

---

## 🗂 Project Structure

```
/src
  ├── Components/
  │   ├── Card.tsx
  │   ├── Button.tsx
  │   └── ConfirmModal.tsx
  ├── store/
  │   └── contentStore.ts
  ├── pages/
  │   └── SavedPosts.tsx
```

---

## 🚀 Future Ideas

- User authentication (Google, GitHub)
- Tag-based filtering
- Notes-only section
- Browser extension for quick save
- Cloud sync across devices

---

## 🙌 Inspiration

Inspired by how people often send themselves links on WhatsApp or Telegram to remember later.  
🎥 [Why I Use a Second Brain | YouTube](https://www.youtube.com/watch?v=47ARX-6srGk)
