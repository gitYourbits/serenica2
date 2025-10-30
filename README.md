# EmotionX - AI Mental Health Platform

AI-powered mental health support with chatbots, mood detection, CBT assessments, and brain training games.

## Features

- 🤖 **AI Chatbots** - CBT, Mindfulness, Career coaching (powered by Ollama/Llama2)
- 😊 **Mood Detection** - Real-time facial expression recognition
- 📝 **CBT Assessments** - PHQ-9, GAD-7, DASS-21, Thought Records
- 🧠 **Brain Training** - 12 neurobic exercises (memory, attention, creativity)
- 📅 **Appointments** - Book sessions with Google Meet integration
- 🔐 **Secure** - Firebase Auth + Firestore with proper security rules

## Tech Stack

- React 18 + Vite
- Firebase (Auth, Firestore, Functions)
- Ollama AI (local, free)
- face-api.js + TensorFlow.js
- CSS Modules

## Quick Start

### Prerequisites
1. Node.js v18+
2. Ollama with llama2: `ollama pull llama2:latest`
3. Firebase project with Auth, Firestore, Functions enabled

### Setup
```bash
# Install
npm install
cd functions && npm install && cd ..

# Configure
cp env.template .env
# Edit .env with Firebase config

# Download face models
npm run download-models

# Verify
npm run verify-setup

# Run
npm run dev
```

Open http://localhost:5173/

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run verify-setup     # Check configuration
npm run download-models  # Get face detection models
```

## Environment Variables

Create `.env` from `env.template` with your Firebase config:
```env
VITE_APP_API_KEY=...
VITE_APP_AUTH_DOMAIN=...
VITE_APP_PROJECT_ID=...
VITE_APP_STORAGE_BUCKET=...
VITE_APP_MESSAGING_SENDER_ID=...
VITE_APP_APP_ID=...
```

## Deployment

```bash
# Build
npm run build

# Deploy security rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Deploy functions & hosting
firebase deploy
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Chatbot not responding | Check Ollama: `ollama list` |
| Firebase errors | Verify `.env` config |
| Camera issues | Allow permissions, use Chrome/Edge |
| 404 on models | Run `npm run download-models` |

Run `npm run verify-setup` to diagnose issues.

## Project Structure

```
src/
├── components/
│   ├── chatbots/         # AI therapist bots
│   ├── questionnaires/   # CBT assessments
│   └── neurobic/         # Brain games
├── context/
│   └── appContext.jsx    # Firebase operations
├── services/
│   ├── questionnaireService.js
│   └── neurobicService.js
└── firebase.js
```

## Security

- Firestore rules in `firestore.rules`
- Environment vars for sensitive config
- Authentication required for all data access
- Indexes optimized in `firestore.indexes.json`

## License

MIT
