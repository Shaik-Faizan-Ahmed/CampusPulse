# 🎓 Campus Pulse

A centralized digital platform for managing and collaborating on college events — with QR-based attendance, role-based access, email reminders, and Razorpay payment integration.

---

## ✨ Features

- **Multi-Organization Support** — Create and manage multiple campus organizations, each with its own URL slug (e.g. `/cse-club/events`)
- **Role-Based Access Control** — Three roles per organization: `admin`, `coordinator`, `student`
- **Event Management** — Create, edit, delete events with categories, seat limits, and image uploads
- **QR Attendance System** — Per-event QR codes for bulk scanning + per-student QR codes for secure individual entry verification
- **Razorpay Payments** — Paid event registration with per-organization Razorpay key configuration
- **Email Reminders** — Automated cron job sends reminder emails 1 hour before events
- **Cloudinary Integration** — Event and organization image uploads via Cloudinary
- **Analytics** — Event participation and attendance stats
- **Next.js Frontend** — Separate React/Next.js frontend for a modern UI experience

---

## 🗂️ Project Structure

```
campus-pulse/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Login, register, logout
│   ├── eventController.js     # Full event CRUD + QR + payments
│   ├── orgController.js       # Org CRUD + member management
│   ├── orgPageController.js   # Public org page
│   ├── announcementController.js
│   └── analyticsController.js
├── jobs/
│   └── cron.js                # Event reminder cron job
├── middleware/
│   └── orgMiddleware.js       # Org slug resolver
├── models/
│   ├── User.js
│   ├── Organization.js
│   ├── Event.js
│   └── Announcement.js
├── routes/
│   ├── authRoutes.js
│   ├── orgRoutes.js
│   ├── orgAuthRoutes.js
│   ├── orgManageRoutes.js
│   ├── eventRoutes.js
│   ├── announcementRoutes.js
│   └── analyticsRoutes.js
├── utils/
│   └── sendEmail.js           # Nodemailer wrapper
├── views/                     # EJS templates
├── public/                    # Static assets (CSS, JS, images)
├── frontend/                  # Next.js frontend app
│   └── src/
│       ├── app/               # App Router pages
│       ├── components/        # Reusable components
│       ├── contexts/          # React contexts
│       ├── services/          # API service layer
│       └── types/             # TypeScript types
├── server.js                  # Express app entry point
├── .env.example               # Environment variable template
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for SMTP

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/campus-pulse.git
cd campus-pulse
```

### 2. Backend Setup

```bash
# Install backend dependencies
npm install

# Copy the env template and fill in your values
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#-environment-variables) below).

```bash
# Start the backend server
npm start
# Server runs at http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install frontend dependencies
npm install

# Copy the env template
cp .env.local.example .env.local

# Start the Next.js dev server
npm run dev
# Frontend runs at http://localhost:3000
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in all values:

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: `5000`) |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for session signing |
| `EMAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP port (`587` for TLS, `465` for SSL) |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Gmail App Password (not your regular password) |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `RAZORPAY_KEY_ID` | Optional — for paid event defaults |
| `RAZORPAY_KEY_SECRET` | Optional — for paid event defaults |

> **⚠️ Never commit your `.env` file.** It is already in `.gitignore`.

---

## 👥 Roles

| Role | Permissions |
|---|---|
| `admin` | Full access — manage members, events, org settings, Razorpay config |
| `coordinator` | Create/edit/delete events, view participants, mark attendance |
| `student` | Register for events, view personal QR, track attendance |

---

## 📡 Key Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Landing page |
| `GET/POST` | `/auth/login` | Global login |
| `GET/POST` | `/auth/register` | Global registration |
| `GET` | `/my-organizations` | User's org list |
| `GET/POST` | `/create-organization` | Create new org |
| `GET` | `/:slug/events` | Event dashboard for org |
| `POST` | `/:slug/events` | Create event |
| `GET` | `/:slug/events/:id` | Event detail |
| `POST` | `/:slug/events/:id/register` | Register for event |
| `GET` | `/:slug/events/:id/qr` | Show attendance QR |
| `GET` | `/:slug/events/:id/scan` | Scan student entry QR |
| `GET` | `/:slug/manage` | Org management (admin only) |

---

## 🛠️ Tech Stack

**Backend**
- [Express.js](https://expressjs.com/) v5
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [EJS](https://ejs.co/) templating
- [Cloudinary](https://cloudinary.com/) for image storage
- [Nodemailer](https://nodemailer.com/) for email
- [node-cron](https://www.npmjs.com/package/node-cron) for scheduled jobs
- [Razorpay](https://razorpay.com/) for payments
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) + [express-session](https://www.npmjs.com/package/express-session) for auth

**Frontend**
- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

---

## 📦 Scripts

**Backend**
```bash
npm start      # Start production server
npm run dev    # Start development server
```

**Frontend** (`cd frontend`)
```bash
npm run dev    # Start Next.js dev server (port 3000)
npm run build  # Build for production
npm start      # Start production server
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

ISC License — see [LICENSE](LICENSE) for details.
