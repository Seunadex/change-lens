# ChangeLens

**AI-powered text comparison with human-friendly summaries and impact analysis**

[![Netlify Status](https://api.netlify.com/api/v1/badges/29793971-3b1f-47d6-a12a-612ace7c4fd0/deploy-status)](https://app.netlify.com/projects/changelens/deploys)

🔗 [Live Demo →](https://changelens.netlify.app/)

ChangeLens is a modern web app that helps you compare two versions of any text, highlight their differences visually, and get an AI-powered summary with a significance rating — so you can tell at a glance whether the change is minor, major, or critical.

---

## ✨ Features

- 🔍 **Visual Diff View**: Inline or side-by-side diff highlighting
- 🤖 **AI Summary Generation**: Powered by Gemma (via AIMLAPI)
- 📊 **Change Significance**: Classifies updates as minor, major, or critical
- 💾 **Session Management**: Save and revisit text comparisons (via localStorage)
- 🧼 **Reset & Clean UI**: Responsive, accessible, and easy to use

---

## 🚀 Live Demo

▶️ [https://changelens.netlify.app](https://changelens.netlify.app)

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **AI Integration**: Google Gemma 3B via [AIMLAPI](https://aimlapi.com)
- **Backend**: Netlify Functions
- **Storage**: LocalStorage

---

## 📦 Getting Started

### 🔧 Requirements

- Node.js `>=18`
- [`netlify-cli`](https://docs.netlify.com/cli/get-started/) installed globally

```bash
npm install -g netlify-cli
```

---

### 📁 Setup Instructions

1. **Clone the Repo**

   ```bash
   git clone https://github.com/seunadex/changelens.git
   cd changelens
   ```

2. **Add Your `.env` File**
   Create a `.env` in the root with your AIMLAPI key:

   ```env
   VITE_API_KEY=your_aimlapi_key_here
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Run the App**

   ```bash
   netlify dev
   ```

   This starts both the frontend and the Netlify backend locally.

---

## 🧠 How It Works

1. Input two text versions.
2. Click **Compare** (with optional AI Summary).
3. View:
   - Diff output (highlighted inline or split)
   - AI summary of what changed
   - Significance rating (`minor`, `major`, `critical`)
4. Save or revisit previous comparisons using the session dropdown.

---

## 👤 Author

Made by **Seun Adekunle**
💼 [LinkedIn →](https://www.linkedin.com/in/seunadex)

---

## 📄 License

[MIT License](LICENSE)
