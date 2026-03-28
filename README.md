<div align="center">
  <img src="public/trusthire-banner.png" alt="TrustHire Banner" width="600" />

  # ⚡ TrustHire

  ### Where Commitment Meets Opportunity

  The first job portal where candidates signal genuine interest through a
  refundable challenge fee — and recruiters see who is truly committed.

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
  [![Razorpay](https://img.shields.io/badge/Razorpay-Payments-blue?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

  [Live Demo](https://trust-hire.vercel.app) · [Report Bug](https://github.com/YOUR_USERNAME/trusthire/issues) · [Request Feature](https://github.com/YOUR_USERNAME/trusthire/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Payment Flow](#-payment-flow)
- [Refund Policy](#-refund-policy)
- [Security](#-security)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**TrustHire** solves a critical problem in online hiring — **fake applications**. Recruiters waste hours reviewing candidates who never show up for interviews.

### The Solution

Candidates can optionally attach a **refundable Challenge Fee** to their application, signaling genuine interest. Recruiters see committed candidates first.

| For Candidates | For Recruiters |
|----------------|---------------|
| ✅ Apply for free or boost with fee | ✅ See committed candidates first |
| ✅ Fee is fully refundable* | ✅ Reduce no-shows by 90% |
| ✅ Stand out from the crowd | ✅ Save hours on screening |
| ✅ Get priority review | ✅ Trust-driven hiring |

> *Fee is refunded in all cases except when a candidate skips a confirmed interview.

---

## ✨ Features

### 🔐 Authentication & Security
- OTP-based email verification (Resend)
- JWT token authentication with 7-day expiry
- Protected routes for applicants & recruiters
- Auth redirect for logged-in users
- IP tracking & activity logging

### 👤 User Profiles
- Applicant profile (bio, skills, resume, location, website)
- Recruiter profile (company, bio, location, website)
- Editable profile with real-time updates

### 💼 Job Management
- Full CRUD for recruiters (create, edit, delete jobs)
- Job filters (search, location, type, salary range)
- Active/closed job status management
- Challenge fee amount configuration per job

### 📋 Application System
- One-click apply with optional cover letter
- Duplicate application prevention
- Application status tracking (pending → invited → attended → hired)
- Priority & standard application separation

### 💰 Payment System (Razorpay)
- Secure payment with HMAC-SHA256 signature verification
- Server-side amount validation
- Stale order auto-cleanup (30 min)
- Instant refund on rejection, hire, or attendance
- Instant forfeit on no-show
- Full payment audit trail

### 🔔 Notifications
- Real-time web notifications with bell icon
- Auto-refresh every 30 seconds
- Mark as read (single & bulk)
- 8 notification types covering full lifecycle
- Auto-delete after 30 days

### 📧 Email Notifications (8 Templates)
- Welcome email on registration
- Application received confirmation
- Priority boost confirmation
- Interview invitation
- Application rejection + refund
- Hired confirmation + refund
- Refund processed
- Fee forfeited (no-show)

### 📊 Dashboards
- **Applicant**: Stats, applications timeline, deposit tracker
- **Recruiter**: Stats, priority applicants, normal applicants, action buttons

### 🛡️ Priority Security (4-Layer)
- Layer 1: Role check + ownership + status validation
- Layer 2: Razorpay cryptographic signature verification
- Layer 3: Server-side cross-verification with payment records
- Layer 4: Database-level indexes + schema validation

### 📝 Database Logging
- All actions logged with timestamps & IP
- User registration, login (success/failed)
- Application lifecycle events
- Payment creation, verification, refund, forfeit
- Auto-delete after 90 days

### 🔄 Automated Refund Engine
- Cron job runs daily (Vercel Cron)
- Auto-refunds unreviewed applications
- Handles edge cases automatically

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | JavaScript (JSX) |
| **Styling** | Tailwind CSS |
| **Database** | MongoDB Atlas + Mongoose |
| **Authentication** | JWT + bcrypt + OTP |
| **Payments** | Razorpay (Test Mode) |
| **Email** | Resend |
| **Deployment** | Vercel |
| **Icons** | React Icons (HeroIcons) |
| **Notifications** | react-hot-toast |
| **State** | React Context API |


---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                  FRONTEND                     │
│  Next.js App Router + Tailwind CSS           │
│  ┌─────────┬──────────┬───────────┐          │
│  │ Landing │ Auth     │ Dashboard │          │
│  │ Page    │ Pages    │ Pages     │          │
│  └─────────┴──────────┴───────────┘          │
│              │                                │
│              ▼                                │
│  ┌────────────────────────────┐              │
│  │     Context (AuthContext)   │              │
│  └────────────────────────────┘              │
└────────────────┬─────────────────────────────┘
                 │ API Calls
                 ▼
┌──────────────────────────────────────────────┐
│                  BACKEND                      │
│  Next.js API Routes (/api/*)                 │
│  ┌──────┬──────┬──────────┬────────┐         │
│  │ Auth │ Jobs │ Payments │ Cron   │         │
│  └──────┴──────┴──────────┴────────┘         │
│              │                                │
│              ▼                                │
│  ┌────────────────────────────┐              │
│  │   MongoDB Atlas + Mongoose  │              │
│  │   ┌──────┬─────┬─────────┐ │              │
│  │   │Users │Jobs │Challenge│ │              │
│  │   │      │     │Fees     │ │              │
│  │   └──────┴─────┴─────────┘ │              │
│  └────────────────────────────┘              │
│              │                                │
│     ┌────────┴────────┐                      │
│     ▼                 ▼                      │
│  Razorpay          Resend                    │
│  (Payments)        (Emails)                  │
└──────────────────────────────────────────────┘
```


---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB Atlas** account (free tier works)
- **Razorpay** account (test mode)
- **Resend** account (free tier)
- **Git** installed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/trusthire.git

# 2. Navigate to project
cd trusthire

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env.local

# 5. Fill in your environment variables (see below)

# 6. Run development server
npm run dev

# 7. Open in browser
# http://localhost:3000


📁 Project Structure
trusthire/
│
├── src/
│   ├── app/                              # NEXT.JS APP ROUTER
│   │   ├── layout.jsx                    # Root layout
│   │   ├── page.jsx                      # Home page
│   │   ├── globals.css                   # Tailwind imports
│   │   ├── loading.jsx                   # Global loading
│   │   ├── not-found.jsx                 # 404 page
│   │   ├── sitemap.js                    # SEO sitemap
│   │   ├── robots.js                     # SEO robots
│   │   │
│   │   ├── (auth)/                       # Auth pages
│   │   │   ├── login/page.jsx
│   │   │   └── register/page.jsx
│   │   │
│   │   ├── jobs/                         # Public job pages
│   │   │   ├── page.jsx                  # Browse all jobs
│   │   │   └── [id]/page.jsx            # Job detail
│   │   │
│   │   ├── applicant/                    # Applicant pages
│   │   │   ├── dashboard/page.jsx
│   │   │   ├── applications/page.jsx
│   │   │   ├── deposits/page.jsx
│   │   │   └── profile/page.jsx
│   │   │
│   │   ├── recruiter/                    # Recruiter pages
│   │   │   ├── dashboard/page.jsx
│   │   │   ├── jobs/page.jsx
│   │   │   ├── jobs/create/page.jsx
│   │   │   ├── jobs/[id]/edit/page.jsx
│   │   │   ├── jobs/[id]/applicants/page.jsx
│   │   │   └── profile/page.jsx
│   │   │
│   │   └── api/                          # BACKEND API
│   │       ├── auth/
│   │       │   ├── login/route.js
│   │       │   ├── register/route.js
│   │       │   ├── send-otp/route.js
│   │       │   ├── verify-otp/route.js
│   │       │   ├── me/route.js
│   │       │   └── profile/route.js
│   │       ├── jobs/
│   │       │   ├── route.js
│   │       │   ├── my/route.js
│   │       │   └── [id]/route.js
│   │       ├── applications/
│   │       │   ├── route.js
│   │       │   ├── my/route.js
│   │       │   ├── job/[id]/route.js
│   │       │   └── [id]/
│   │       │       ├── route.js
│   │       │       ├── invite/route.js
│   │       │       ├── reject/route.js
│   │       │       ├── hire/route.js
│   │       │       ├── attended/route.js
│   │       │       └── no-show/route.js
│   │       ├── payments/
│   │       │   ├── create-order/route.js
│   │       │   ├── verify/route.js
│   │       │   └── my-deposits/route.js
│   │       ├── notifications/
│   │       │   ├── route.js
│   │       │   ├── read-all/route.js
│   │       │   └── [id]/read/route.js
│   │       ├── dashboard/
│   │       │   ├── recruiter/route.js
│   │       │   └── applicant/route.js
│   │       ├── logs/route.js
│   │       └── cron/refund-engine/route.js
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── SmartCTALink.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── RoleSelector.jsx
│   │   │   └── AuthRedirect.jsx
│   │   ├── jobs/
│   │   ├── applications/
│   │   ├── payments/
│   │   └── dashboard/
│   │
│   ├── context/AuthContext.jsx
│   ├── hooks/
│   ├── lib/
│   │   ├── db.js
│   │   ├── auth.js
│   │   ├── razorpay.js
│   │   ├── resend.js
│   │   ├── notifications.js
│   │   ├── logger.js
│   │   └── refundEngine.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── ChallengeFee.js
│   │   ├── Notification.js
│   │   ├── Log.js
│   │   └── Otp.js
│   ├── emails/
│   │   ├── welcomeEmail.js
│   │   ├── applicationReceived.js
│   │   ├── priorityConfirmation.js
│   │   ├── interviewInvite.js
│   │   ├── applicationRejected.js
│   │   ├── hiredConfirmation.js
│   │   ├── refundProcessed.js
│   │   └── feeForfeited.js
│   └── utils/
│
├── public/
│   ├── icon.png
│   ├── trusthire-banner.png
│   ├── robots.txt
│   └── manifest.json
│
├── vercel.json
├── .env.local
├── .env.example
├── .gitignore
├── package.json
└── README.md

💰 Payment Flow
APPLICANT                    SERVER                      RAZORPAY
─────────                    ──────                      ────────
    │                           │                            │
    │  1. Click "Boost"         │                            │
    ├──────────────────────────►│                            │
    │                           │  2. Create Order           │
    │                           ├───────────────────────────►│
    │                           │  3. Order ID               │
    │                           │◄───────────────────────────┤
    │  4. Order ID              │                            │
    │◄──────────────────────────┤                            │
    │                           │                            │
    │  5. Pay via Razorpay UI   │                            │
    ├───────────────────────────┼───────────────────────────►│
    │                           │                            │
    │  6. Payment Success       │                            │
    │   (payment_id, signature) │                            │
    │◄──────────────────────────┼────────────────────────────┤
    │                           │                            │
    │  7. Verify Signature      │                            │
    ├──────────────────────────►│                            │
    │                           │  8. HMAC-SHA256 Check      │
    │                           │  9. Mark isPriority=true   │
    │                           │  10. Send Email + Notif    │
    │  11. Success!             │                            │
    │◄──────────────────────────┤                            │
    │                           │                            │

🔄 Refund Policy
┌─────────────────────────────────────────────┐
│            REFUND DECISION TREE              │
│                                             │
│  Application Submitted with Challenge Fee    │
│                    │                         │
│           ┌───────┴───────┐                  │
│           ▼               ▼                  │
│       Rejected        Invited to             │
│       ✅ REFUND       Interview              │
│                          │                   │
│                  ┌───────┴───────┐           │
│                  ▼               ▼           │
│              Attended        No-Show         │
│              ✅ REFUND       ❌ FORFEITED    │
│                  │                           │
│          ┌───────┴───────┐                   │
│          ▼               ▼                   │
│        Hired          Rejected               │
│        ✅ REFUND      ✅ REFUND              │
│                                             │
│  Not Reviewed (expired)                      │
│  ✅ REFUND (via cron)                        │
└─────────────────────────────────────────────┘

---

## 🛡️ Security

### Authentication Security
| Feature | Implementation |
|---------|---------------|
| Password hashing | bcrypt with 10 salt rounds |
| JWT tokens | 7-day expiry, server-side verification |
| OTP verification | 5-minute expiry, max 5 attempts |
| Protected routes | Server-side middleware on all API routes |
| Auth redirect | Logged-in users redirected from login/register |

### Payment Security (4-Layer)
Layer 1: Request Validation
├── Only applicants can create orders (role check)
├── Application must belong to user (ownership)
├── Application must be pending (status check)
├── Job must be active (job status check)
├── Amount set server-side from job config
└── Amount validated (₹1 - ₹50,000)

Layer 2: Razorpay Verification
├── HMAC-SHA256 cryptographic signature
├── Server-side signature comparison
├── Payment ID must match order
└── Failed attempts logged with IP

Layer 3: Priority Cross-Verification
├── isPriority only set after verified payment
├── Recruiter view cross-checks ChallengeFee records
├── Unverified priorities flagged as false
└── Full audit trail with timestamps

Layer 4: Database Level
├── Unique index: one fee per application
├── Unique index: one application per job per user
├── Min/max validation on amount
├── Pre-save hooks for audit timestamps
└── Stale orders auto-cleaned (30 min)

### Data Security
| Feature | Implementation |
|---------|---------------|
| Password in API responses | Excluded via `select: false` + `toJSON` |
| Environment variables | Server-side only (except `NEXT_PUBLIC_*`) |
| MongoDB injection | Mongoose schema validation |
| XSS protection | React auto-escaping + input validation |
| Rate limiting | Vercel built-in DDoS protection |
| IP tracking | All actions logged with user IP |

---

## 📧 Email Templates

All emails feature responsive HTML design with TrustHire branding:

| # | Template | Trigger | Color Theme |
|---|----------|---------|-------------|
| 1 | Welcome | User registers | 🟣 Purple gradient |
| 2 | Application Received | User applies | 🟣 Purple |
| 3 | Priority Confirmed | Payment verified | 🟡 Amber gradient |
| 4 | Interview Invite | Recruiter invites | 🟢 Green gradient |
| 5 | Application Rejected | Recruiter rejects | 🟣 Purple |
| 6 | Hired Confirmation | Recruiter hires | 🟢 Green gradient |
| 7 | Refund Processed | Fee refunded | 🟢 Green gradient |
| 8 | Fee Forfeited | No-show marked | 🔴 Red gradient |

---

## 🔔 Notification System

### Web Notifications
- 🔔 Bell icon in navbar with unread count badge
- Auto-refresh every 30 seconds
- Click to mark as read + navigate
- Bulk "Mark all read" action
- Auto-delete after 30 days

### Notification Types
🎉 welcome → Account created
📋 application_received → Application submitted
⭐ priority_confirmed → Payment verified
🎯 interview_invited → Interview invitation
😔 rejected → Application rejected
🥳 hired → Candidate hired
💰 refund_processed → Fee refunded
⚠️ fee_forfeited → Fee forfeited (no-show)
✅ interview_attended → Interview attended


---

## 📝 Database Logging

### What Gets Logged
| Action | When | Status |
|--------|------|--------|
| `user_registered` | New signup | ✅ success |
| `user_login` | Successful login | ✅ success |
| `user_login_failed` | Wrong credentials | ❌ failed |
| `profile_updated` | Profile edit | ✅ success |
| `application_created` | Job application | ✅ success |
| `application_invited` | Interview invite | ✅ success |
| `application_rejected` | Rejection | ✅ success |
| `application_hired` | Hire | ✅ success |
| `application_attended` | Interview attended | ✅ success |
| `application_no_show` | No-show | ✅ success |
| `payment_order_created` | Razorpay order | ✅ success |
| `payment_verified` | Payment confirmed | ✅ success |
| `payment_failed` | Signature mismatch | ❌ failed |
| `refund_processed` | Money refunded | ✅ success |
| `fee_forfeited` | Fee forfeited | ⚠️ warning |

### Log Features
- 📍 IP address tracking on all actions
- 📊 Rich metadata per log entry
- 🔍 Indexed for fast queries (action, user, date)
- 🧹 Auto-delete after 90 days
- 🔒 Users can only view their own logs

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main



📄 License
MIT License

Copyright (c) 2024 TrustHire

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



🙏 Acknowledgments
Next.js — React framework
MongoDB Atlas — Cloud database
Razorpay — Payment gateway
Resend — Email API
Tailwind CSS — Utility-first CSS
Vercel — Deployment platform
React Icons — Icon library




