# EmotionX Setup

## Prerequisites

1. **Node.js v18+** → https://nodejs.org/
2. **Ollama** → https://ollama.com/
3. **Firebase Account** → https://console.firebase.google.com/

## Quick Setup

### 1. Install Ollama & Model
```bash
# Download Ollama from https://ollama.com/
# Then pull the AI model (3.8GB)
ollama pull llama2:latest
```

### 2. Create Firebase Project
- Go to https://console.firebase.google.com/
- Create new project
- Enable: **Authentication** (Email/Password)
- Enable: **Firestore Database** (test mode)
- Enable: **Cloud Functions** (Blaze plan - free tier)
- Get config: Settings → Project settings → Your apps → Web app

### 3. Install Dependencies
```bash
npm install
cd functions && npm install && cd ..
```

### 4. Configure Environment
```bash
# Copy template
copy env.template .env    # Windows
cp env.template .env      # Mac/Linux

# Edit .env with your Firebase config
```

Your `.env` should look like:
```env
VITE_APP_API_KEY=your-firebase-api-key
VITE_APP_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_APP_PROJECT_ID=your-project-id
VITE_APP_STORAGE_BUCKET=your-project.appspot.com
VITE_APP_MESSAGING_SENDER_ID=123456789012
VITE_APP_APP_ID=1:123456789012:web:abc123
VITE_OLLAMA_API_URL=http://localhost:11434/api/generate
VITE_OLLAMA_MODEL=llama2:latest
```

### 5. Download Face Models
```bash
npm run download-models
```

### 6. Verify Setup
```bash
npm run verify-setup
```
Should show all ✅. If not, fix the issues shown.

### 7. Run
```bash
npm run dev
```
Open http://localhost:5173/

## Deploy Security Rules (Production)
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Common Issues

| Issue | Fix |
|-------|-----|
| Chatbot not responding | `ollama pull llama2:latest` |
| Firebase error | Check `.env` file has correct values |
| Camera not working | Allow browser permissions, use Chrome |
| Models 404 | `npm run download-models` |

## Features

- AI Chatbots (CBT, Mindfulness, Career)
- Real-time Mood Detection
- Mental Health Assessments (PHQ-9, GAD-7, DASS-21)
- Brain Training Games (12 exercises)
- Appointment Booking

