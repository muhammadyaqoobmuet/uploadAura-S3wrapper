# 🌲 UploadAura

<div align="center">

![UploadAura Banner](./client/public/uploadAura.png)

**The simplest cloud storage API you'll ever use.**

Skip AWS S3 buckets, IAM policies, and endless configuration. UploadAura gives you an API key and a clean dashboard — ship your product in minutes.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/s3/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

[Live Demo](https://uploadaura.dev) • [Documentation](#-documentation) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🚀 **Developer First**
- Clean REST API with JWT authentication
- API key management built-in
- TypeScript throughout for type safety
- Comprehensive error handling

</td>
<td width="50%">

### 🎨 **Beautiful Dashboard**
- Drag-and-drop file uploads
- Real-time storage analytics
- Inline file previews (images, PDFs, videos)
- One-click public URL sharing

</td>
</tr>
<tr>
<td>

### 🔐 **Secure by Default**
- Google OAuth 2.0 integration
- JWT + refresh token system
- API key hashing with bcrypt
- Storage quota enforcement

</td>
<td>

### ⚡ **Production Ready**
- AWS S3 integration for reliable storage
- Winston logging with daily rotation
- Zod validation on all inputs
- Prisma ORM for database safety

</td>
</tr>
</table>

---

## 🎯 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** database
- **AWS S3** bucket with access keys
- **Google OAuth** credentials (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/muhammadyaqoobmuet/uploadAura-S3wrapper.git
cd uploadAura-S3wrapper

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# Install client dependencies
cd ../client
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Run database migrations
cd ../backend
npx prisma migrate dev
npx prisma generate
```

### Running Locally

```bash
# Terminal 1 - Backend (runs on http://localhost:5000)
cd backend
npm run dev

# Terminal 2 - Client (runs on http://localhost:3000)
cd client
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000)** and start uploading!

---

## 🏗️ Architecture

```
uploadaura/
├── backend/                    # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes (internal + public v1)
│   │   ├── middlewares/       # Auth, validation, error handling
│   │   ├── models/            # Prisma schema & models
│   │   ├── config/            # AWS S3, Passport, Multer config
│   │   └── utils/             # Helpers, JWT, bcrypt, logging
│   └── prisma/schema.prisma   # Database schema
│
├── client/                     # Next.js 15 (App Router)
│   ├── app/                   # Routes and pages
│   │   ├── (auth)/            # Login & register
│   │   ├── dashboard/         # Protected dashboard
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── landing/           # Hero, Features, Pricing, etc.
│   │   ├── dashboard/         # FileList, Sidebar, StorageBar
│   │   └── ui/                # Button, Badge, Modal
│   └── providers/             # AuthProvider, ToastProvider
│
└── README.md                   # You are here! 👋
```

---

## 🔑 Environment Variables

### Backend `.env`

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/uploadaura"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-token-secret"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET_NAME="uploadaura-files"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/internal/auth/google/callback"

# Server
PORT=5000
CLIENT_URL="http://localhost:3000"
```

### Client `.env.local`

```bash
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

## 📚 API Reference

### Authentication

```bash
# Register a new user
POST /api/internal/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

# Login
POST /api/internal/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

# Response includes JWT access token + refresh token
```

### File Upload (Authenticated)

```bash
# Upload file via dashboard API
POST /api/internal/files/upload
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

file: <binary-file-data>
```

### Public API (API Key)

```bash
# Upload via API key
POST /api/v1/files/upload
X-API-KEY: <your-api-key>
Content-Type: multipart/form-data

file: <binary-file-data>

# Response
{
  "success": true,
  "data": {
    "fileUrl": "https://uploadaura-files.s3.amazonaws.com/abc123.png",
    "fileName": "screenshot.png",
    "fileSize": 1048576,
    "mimeType": "image/png"
  }
}
```

### API Key Management

```bash
# Generate new API key
POST /api/internal/api-keys/generate
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Production API Key"
}

# List all API keys
GET /api/internal/api-keys
Authorization: Bearer <your-jwt-token>

# Delete API key
DELETE /api/internal/api-keys/:id
Authorization: Bearer <your-jwt-token>
```

---

## 🎨 Tech Stack

### Backend
- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js with async error handling
- **Database:** PostgreSQL + Prisma ORM
- **Storage:** AWS S3 with presigned URLs
- **Auth:** Passport.js (JWT + Google OAuth)
- **Validation:** Zod schemas
- **Logging:** Winston with daily rotation
- **File Handling:** Multer (multipart/form-data)

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Variables + Custom Design System
- **Animations:** Framer Motion with reduced-motion support
- **Icons:** Lucide React
- **HTTP Client:** Fetch API with custom hooks
- **State Management:** React Context (AuthProvider)

### DevOps
- **Version Control:** Git with conventional commits
- **Code Formatting:** Prettier
- **Process Manager:** Nodemon (development)
- **Deployment Ready:** Vercel (client) + Railway/Render (backend)

---

## 🚀 Deployment

### Backend (Railway / Render)

1. Push your code to GitHub
2. Connect to Railway or Render
3. Set environment variables in dashboard
4. Run migrations: `npx prisma migrate deploy`
5. Deploy! 🎉

### Client (Vercel)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy automatically on push

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📝 Documentation

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm start            # Run production build
npm run prisma:push  # Push schema changes to DB
npm run prisma:studio # Open Prisma Studio GUI
```

**Client:**
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

---

## 📊 Project Stats

- **Lines of Code:** ~15,000+
- **Components:** 30+ React components
- **API Endpoints:** 25+ REST endpoints
- **Type Safety:** 100% TypeScript coverage
- **Authentication:** JWT + OAuth 2.0
- **Storage Limit:** 2 GB free tier, 100 MB per file

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Framer Motion](https://www.framer.com/motion/) for beautiful animations
- [Prisma](https://www.prisma.io/) for type-safe database access
- [AWS S3](https://aws.amazon.com/s3/) for reliable object storage
- [Lucide](https://lucide.dev/) for clean, consistent icons

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Muhammad Yaqoob** - [@muhammadyaqoobmuet](https://github.com/muhammadyaqoobmuet)

**Project Link:** [https://github.com/muhammadyaqoobmuet/uploadAura-S3wrapper](https://github.com/muhammadyaqoobmuet/uploadAura-S3wrapper)

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

Made with ❤️ by developers, for developers.

</div>
