# Todo App with Drag & Drop (DND)

A modern Todo application built with **React, Redux Toolkit, Tailwind CSS, and dnd-kit**, featuring full CRUD functionality along with smooth drag-and-drop interactions across multiple sections.

---

##  Features

* Create, update, and delete tasks
* Organize tasks into three sections:
  * Todo
  * In Progress
  * Done
* Drag & drop tasks between columns
* Reorder tasks within the same column
* Optimized state management using Redux Toolkit
* Loading overlay & ❌ error handling overlay
* Retry mechanism on API failure

---

## Tech Stack

* **Frontend:** React (Vite)
* **State Management:** Redux Toolkit
* **Drag & Drop:** dnd-kit
* **Styling:** Tailwind CSS
* **Icons:** React Icons

---

## Project Structure

```
src/
│── components/
│   ├── TaskCard.jsx
│   ├── Sections.jsx
│
│── pages/
│   ├── TodoPage.jsx
│
│── redux/
│   ├── taskSlice.js
│   ├── store.js
│
│── App.jsx
│── main.jsx
```

---

## ⚙️ Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/your-username/todo-dnd-app.git
cd todo-dnd-app
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

---

## How It Works

# Drag & Drop

* Uses **dnd-kit** for drag-and-drop interactions
* `DndContext` wraps the app
* `DragOverlay` provides smooth dragging visuals
* `useDroppable` defines columns
* `useSortable` enables sorting within columns

## State Management

* Tasks are stored in Redux
* Actions:
  * Add task
  * Delete task
  * Update task
  * Update task status (dragging)
  * Reorder tasks (sorting)

### Sorting Logic

* `SortableContext` is used per column
* `arrayMove` reorders tasks
* State is updated using `setTasks`

---

## 🎯 UX Highlights

* Smooth drag animations across columns
* Overlay loader instead of blocking UI
* Error overlay with retry button
* Drag handle for better interaction
* No UI flicker during updates

---

## 🔮 Future Improvements

* Imporve UI 
* Add due dates & priority levels
* Add filters & search
* Mobile drag optimization

---

## 📌 Author

**Abhijeet Mali**
React | MERN Developer

