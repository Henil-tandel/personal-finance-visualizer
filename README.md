#  Personal Finance Visualizer

A simple and responsive web app to track personal transactions and visualize monthly expenses. Built with **Next.js**, **React**, **TailwindCSS**, **MongoDB**, **Recharts**, and **shadcn/ui**.

##  Features

✅ Add, edit, and delete transactions  
✅ Monthly expenses bar chart (Recharts)  
✅ Validated transaction form  
✅ Responsive and minimal UI (shadcn/ui + Tailwind)  
✅ Clean codebase (Client components only)

##  Tech Stack

- **Next.js App Router**
- **React**
- **MongoDB (via /api routes)**
- **Tailwind CSS**
- **shadcn/ui** components
- **Recharts** for charting
- **Sonner** for toast notifications

##  Live URL

[https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

##  Setup Instructions

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/personal-finance-visualizer.git
cd personal-finance-visualizer
npm install

# Add your environment variables
touch .env.local
# Add: MONGODB_URI=your_mongodb_connection_string

# Run locally
npm run dev
