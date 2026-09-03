# RM Communication Ltd - Broadband & Telecom Web Portal

A modern, responsive web application for **RM Communication Ltd** built with React, TypeScript, and Vite.

---

## 🌐 Production & Live Server Details

- **Live Production Website**: [https://www.rmcommunicationltd.com](https://www.rmcommunicationltd.com)
- **Live Admin Login Portal**: [https://www.rmcommunicationltd.com/admin](https://www.rmcommunicationltd.com/admin)
- **GitHub Repository**: [https://github.com/shihabuddin212/rm-communication-ltd](https://github.com/shihabuddin212/rm-communication-ltd)
- **Ubuntu VPS Server**: `msonline@103.60.205.230`

---

## 🔐 Admin Panel Credentials

- **Username / Email**: `admin@rmcommunication.com`
- **Password**: `rm@admin2026`
- **Localhost Route**: `/admin` (e.g. `http://localhost:5173/admin`)

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 💻 Quick Deployment Guide (Ubuntu VPS: msonline@103.60.205.230)

1. **SSH into Ubuntu Server**:
   ```bash
   ssh msonline@103.60.205.230
   ```
2. **Navigate to App Directory & Pull Latest Code**:
   ```bash
   cd /var/www/rm-comm
   git pull origin main
   ```
3. **Install & Rebuild Production Bundle**:
   ```bash
   npm install
   npm run build
   ```
4. **Reload Nginx**:
   ```bash
   sudo systemctl reload nginx
   ```

---

## ✨ Core Features Included
- **Dynamic Package Ordering**: Clicking "Get [Package Name]" on Home page or Pricing page redirects directly to Contact Page (`/contact`), auto-selects **New Connection**, and prefills the message box with: `Hello, I would like to subscribe to the "[Package Name]" package. Please get back to me.`
- **Services & Solutions Inquiry**: Clicking arrow on any Service card redirects to `/contact`, selects **Service & Solutions** subject, and submits seamlessly to Admin.
- **Dynamic Customer Testimonials (What Our Customers Say)**: Real-time CRUD management in Admin Panel with live UI updates.
- **Interactive Live Speedometer**: Dual Download/Upload motion gauge with toggling zero states.
- **Referral Offer Popup Banner**: Site visit modal featuring `RMC_Prize.jpg`, referral offer details, and Google Form sign-up link.
- **Support & Newsletter Messages System**: Full CRUD management in Admin Panel for support inquiries and newsletter subscribers.
