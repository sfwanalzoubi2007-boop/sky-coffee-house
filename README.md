<div align="center">
  <img src="assets/images/Screenshot.png" alt="Rannaghor Banner" width="100%">
  
  <h1>Rannaghor</h1>
  <p><strong>A Next-Generation Restaurant Ordering & Management System</strong></p>

  <p>
    <a href="https://tamimtxd.github.io/restaurant-ordering-system/" target="_blank" rel="noopener noreferrer"><strong>Explore the Live Demo »</strong></a>
  </p>
</div>

***

## 📖 Overview

**Rannaghor** is a modern, high-performance web application designed to bridge the gap between dining customers and restaurant kitchens. Built entirely with vanilla web technologies and powered by Supabase for real-time synchronization, it delivers an app-like experience without requiring any downloads.

The system features a **luxury dark-mode Glassmorphic UI**, seamless order tracking, and a dedicated synchronization dashboard that allows staff to manage tables and orders in real-time.

## ✨ Key Features

### 🎨 Elite User Interface & Experience
- **Cinematic Dark Mode & Glassmorphism:** A breathtaking modern aesthetic featuring frosted glass panels, deep mesh gradients, and tactile micro-animations.
- **Fluid Responsiveness:** Built without relying heavily on media queries, utilizing advanced CSS `clamp()` functions to ensure typography and geometry scale flawlessly across mobile, tablet, and desktop displays.
- **Dynamic Interactions:** Features sophisticated hover states, interactive light-shine effects on primary actions, and smooth physical push-scaling for intuitive feedback.

### 🍽️ Customer Ordering System
- **QR Code Table Detection:** Customers scan a QR code at their table to instantly launch the app assigned to their specific dining session.
- **Interactive Menu:** A categorized, highly visual menu with a full-bleed hero slider for "Today's Specials".
- **Real-Time Cart & Checkout:** Add items, modify quantities, and check out with instant tax calculations. No refreshing required.
- **Live Order Tracking:** Customers watch their order status change in real-time as the kitchen prepares it (Received → Preparing → Ready).
- **Post-Meal Rating System:** Once an order is served, an elegant modal automatically prompts customers to rate their individual dishes and provide feedback.

### 👨‍🍳 Kitchen Staff Dashboard
- **Instant Synchronization:** Connected to the Supabase Realtime API, new orders appear instantly on the dashboard with a notification chime.
- **Order Lifecycle Management:** Kitchen staff can smoothly transition orders through preparation stages.
- **Staff Gateway:** Password-protected (`123`) authorization layer to prevent unauthorized access by customers.

## 🛠️ Technology Stack

Rannaghor is built to be fast, lightweight, and deployable anywhere. 

*   **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+). No heavy frameworks.
*   **Design System:** Custom CSS tokens, advanced Flexbox/Grid layouts, CSS transitions, and keyframe animations.
*   **Icons:** <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer">Lucide Icons</a> (Lightweight SVG integration).
*   **Backend / Database:** <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer">Supabase</a>. Handles PostgreSQL storage and WebSocket real-time event subscriptions.

## 📂 Architecture & Project Structure

```text
rannaghor/
├── index.html              # The main customer-facing application
├── kitchen.html            # The secure real-time Kitchen Dashboard
├── qr-codes.html           # Utility page for generating table connection QR codes
├── css/
│   ├── style.css           # Global design system, animations, and main UI
│   └── kitchen.css         # Specialized stylesheet for the dashboard grids
├── js/
│   ├── script.js           # Core state management, DOM logic, and cart math
│   ├── kitchen.js          # Staff dashboard logic and order state mutations
│   └── supabase-config.js  # Database initialization and realtime listeners
└── assets/                 # High-resolution food photography and media
```

## 🚀 Quick Setup Guide

Want to run Rannaghor locally or fork the project for your own restaurant? 

### 1. Clone the Repository
```bash
git clone https://github.com/tamimtxd/restaurant-ordering-system.git
cd restaurant-ordering-system
```

### 2. Configure Supabase (Optional but Recommended)
Rannaghor functions with heavy caching and `localStorage` as a fallback, but the magic happens when connected to a live database.
1. Create a free account at <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer">Supabase</a>.
2. Create a new project and initialize a table named **`orders`**.
3. Obtain your `SUPABASE_URL` and `SUPABASE_KEY` from your project settings.
4. Open the `js/supabase-config.js` file and replace the placeholder API credentials with yours.

### 3. Launch
Because it uses vanilla web architecture, you do not need Node.js or a build step.
Simply open `index.html` in your favorite modern browser, or use a tool like VS Code Live Server to run it locally.

## 🔮 Roadmap & Future Expansion

This project is actively maintained. Upcoming milestones include:

- [ ] **Dynamic Admin Panel:** A secure interface for restaurant managers to seamlessly add or edit menu items.
- [ ] **Digital Checkout Flow:** Secure integration with payment gateways (e.g., Stripe) to allow customers to pay digitally.
- [ ] **Advanced Analytics:** A dashboard for restaurant owners to track peak hours and revenue metrics.
- [ ] **User Accounts:** Persistent profiles and order histories using Supabase Auth.
- [ ] **Rewards System:** A simple loyalty program to reward frequent diners.

## 📄 License & Credits

This project is open-sourced under the **MIT License**. You are free to copy, modify, and distribute the work for both personal and commercial use. 

*Designed and Developed passionately in Bangladesh.* 🇧🇩
