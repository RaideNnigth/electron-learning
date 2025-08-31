# Electron Image Resizer (Learning Project)

A simple desktop app built with **Electron** to quickly resize images.  
This repository follows and adapts the excellent Traversy Media tutorial as a hands-on way to learn Electron fundamentals.

---

## ✨ Features

- Select a local image and preview its original dimensions
- Enter a target width and height
- Resize and save the output image to a dedicated folder in your home directory
- Basic validation and friendly error messages

---

<img width="496" height="598" alt="screen" src="https://github.com/user-attachments/assets/79cf6d36-a506-4dc8-8641-be348b1072e4" />


## 🧰 Tech Stack

- **Electron** (Renderer + Main process)
- **Node.js**
- **Sharp** (image processing)
- **HTML/CSS/Vanilla JS**

> Exact dependencies and versions are defined in `package.json`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** (bundled with Node)

### 1) Clone the repo
```bash
git clone https://github.com/RaideNnigth/electron-learning.git
cd electron-learning
````

### 2) Install dependencies

```bash
npm install
```

### 3) Run in development

```bash
npm start
```

This should launch the Electron app window.

## 🖼️ How to Use

1. Open the app.
2. Click **Select Image** and choose a file (`.jpg`, `.png`, etc.).
3. The app will show the current dimensions.
4. Enter the **Width** and **Height** you want.
5. Click **Resize**.
6. The resized image will be saved to an `imageresizer` folder in your home directory (e.g., `~/imageresizer`).
   
---

## 🗂️ Project Structure (typical)

```
electron-learning/
├─ package.json
├─ main.js             # Electron main process
├─ index.html          # Renderer page
├─ renderer.js         # UI logic (DOM handling)
├─ assets/             # Icons or static assets
└─ ...
```

> Filenames may vary slightly depending on your implementation.

---

## 🙏 Credits

This project is heavily inspired by:

* **Traversy Media – Electron Image Resizer Tutorial (YouTube)**
  [https://www.youtube.com/watch?v=ML743nrkMHw\&ab\_channel=TraversyMedia](https://www.youtube.com/watch?v=ML743nrkMHw&ab_channel=TraversyMedia)

* **Original reference repo by Brad Traversy**
  [https://github.com/bradtraversy/image-resizer-electron](https://github.com/bradtraversy/image-resizer-electron)

Many thanks to Brad for the great learning material!

