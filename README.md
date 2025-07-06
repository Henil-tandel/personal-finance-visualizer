#  Personal Finance Visualizer

A simple and responsive web app to track personal transactions and visualize monthly expenses. Built with **Next.js**, **React**, **TailwindCSS**, **MongoDB**, **Recharts**, and **shadcn/ui**.

---

##  Features

 Add, edit, and delete transactions with validation   
 Monthly expenses bar chart (Recharts)  
 Category-wise pie chart  
 Recent transactions & category summaries  
 Form auto-switches to update mode when editing  
 Clean, responsive, and modern UI (shadcn/ui + Tailwind)  
 Toast notifications using Sonner  
 Fully client-side rendered with clean state management  

---

##  Tech Stack

- **Next.js App Router**
- **React**
- **MongoDB** (via API routes)
- **Tailwind CSS**
- **shadcn/ui** components
- **Recharts** for interactive charts
- **Sonner** for toasts
- **Context API** for global state refresh

---

##  Live Demo

[https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

---

##  Setup Instructions

```bash
# 1. Clone the repo and install dependencies
git clone https://github.com/YOUR_USERNAME/personal-finance-visualizer.git
cd personal-finance-visualizer
npm install

# 2. Configure environment variables
touch .env.local
# Add the following:
MONGODB_URI=your_mongodb_connection_string

# 3. Run the development server
npm run dev
