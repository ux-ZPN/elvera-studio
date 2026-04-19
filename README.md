# Elvéra Studio

Elvéra Studio is a premium e-commerce platform designed for a seamless shopping experience. Built with modern web technologies, it features a curated catalog, secure admin management, and robust order tracking.

## 🚀 Features

- **Storefront**: Beautiful, responsive product catalog and collections.
- **Admin Panel**: Secure dashboard for managing products, categories, and orders.
- **Authentication**: Integrated with Supabase for secure user authentication and RLS (Row-Level Security).
- **Order Tracking**: Custom tracking system for customers to monitor their purchases.
- **WhatsApp Integration**: Direct communication for customer support.

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS (Custom Design System)
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router DOM

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ux-ZPN/elvera-studio.git
   cd elvera-studio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🔐 Security

This project uses Supabase Row-Level Security (RLS) to ensure that customer data and admin functions are protected. Always ensure your `SERVICE_ROLE_KEY` is kept private and never pushed to client-side repositories.

---

Built with ❤️ by Elvéra Studio Team.
