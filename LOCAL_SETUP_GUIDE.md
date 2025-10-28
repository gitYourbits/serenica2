# 🏠 Complete Local Development Setup

## ✅ You're All Set for Local Development!

Everything now runs **100% locally** on your machine - no cloud services, no API keys, no internet needed!

---

## 🚀 How to Run (Simple 2-Step Process)

### Step 1: Start Firebase Emulators (Local Database)
Open a terminal and run:
```bash
npm run emulators
```

**What this does:**
- ✅ Starts local Auth server (port 9099)
- ✅ Starts local Firestore database (port 8080)
- ✅ Opens Emulator UI at http://localhost:4000
- ✅ All data stored locally in `.firebase/` folder

**Wait for this message:**
```
✔  All emulators ready! It is now safe to connect your app.
```

### Step 2: Start Your App (In a NEW terminal)
Open a **second terminal** and run:
```bash
npm run dev
```

**What this does:**
- ✅ Starts Vite development server
- ✅ Opens app at http://localhost:5173
- ✅ Connects to local emulators automatically

---

## 🎯 Quick Test

1. Open http://localhost:5173
2. Click **"Sign Up"**
3. Create an account with any email/password
4. It works! ✅ (No API key needed!)

**View Your Data:**
- Open http://localhost:4000 (Emulator UI)
- See all users, database entries in real-time

---

## 📊 What's Running Locally

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Your App** | 5173 | http://localhost:5173 | Main application |
| **Firestore DB** | 8080 | (internal) | Local database |
| **Auth Service** | 9099 | (internal) | Local authentication |
| **Emulator UI** | 4000 | http://localhost:4000 | View/manage data |

---

## 🛠️ Development Workflow

### Daily Development
```bash
# Terminal 1 - Start emulators (keep running)
npm run emulators

# Terminal 2 - Start app (keep running)
npm run dev
```

### Stop Everything
```
Ctrl+C in both terminals
```

### Reset Local Database
Delete all local data and start fresh:
```bash
# Stop emulators first (Ctrl+C)
rm -rf .firebase
npm run emulators
```

---

## 📁 Local Data Storage

All your data is stored in:
```
.firebase/
├── emulators/
│   ├── auth_export/          # Local users
│   └── firestore_export/     # Local database
```

**Notes:**
- `.firebase/` is gitignored (won't be committed)
- Data persists between restarts
- Delete folder to reset everything

---

## 🎨 Emulator UI Features (http://localhost:4000)

The Emulator UI lets you:
- 👤 **View all users** created via signup
- 📊 **Browse Firestore collections** (questionnaires, neurobic sessions, appointments)
- ✏️ **Edit data** directly in the UI
- 🗑️ **Delete data** for testing
- 📥 **Export data** for backup
- 📤 **Import data** from backup

---

## 🔧 Configuration Files

### `.env` (Already Created)
```env
VITE_APP_API_KEY=demo-api-key
VITE_APP_AUTH_DOMAIN=localhost
VITE_APP_PROJECT_ID=demo-emotionx
VITE_APP_STORAGE_BUCKET=demo-emotionx.appspot.com
VITE_APP_MESSAGING_SENDER_ID=123456789
VITE_APP_APP_ID=1:123456789:web:abc123
VITE_USE_FIREBASE_EMULATORS=true
```

**Important:** The flag `VITE_USE_FIREBASE_EMULATORS=true` tells the app to use local emulators.

### `firebase.json` (Already Configured)
Emulator ports are configured:
- Auth: 9099
- Firestore: 8080
- UI: 4000

---

## 🐛 Troubleshooting

### Issue: "Port already in use"

**Solution:**
```bash
# Kill processes on the ports
npx kill-port 4000 8080 9099
```

### Issue: "Connection refused" when signing up

**Solution:**
1. Make sure emulators are running first
2. Check for the "All emulators ready!" message
3. Restart dev server: Ctrl+C → `npm run dev`

### Issue: App connects to cloud instead of local

**Solution:**
1. Check `.env` file has `VITE_USE_FIREBASE_EMULATORS=true`
2. Restart dev server
3. Check browser console for: "🔧 Running in LOCAL mode"

### Issue: Data disappeared after restart

**Solution:**
Emulators clear data by default. To persist data between restarts:
```bash
# Export data
firebase emulators:export ./emulator-data

# Import on next start
firebase emulators:start --import=./emulator-data
```

---

## 🎓 Sample Data

Want to test with sample data? You can manually add it via:

### Option 1: Via Emulator UI
1. Open http://localhost:4000
2. Go to Firestore tab
3. Manually create collections and documents

### Option 2: Via Your App
Just use the app normally:
- Sign up users
- Take questionnaires
- Play neurobic games
- Book appointments
- All data saves locally!

---

## 🚀 Production vs Local

### Local Mode (Current Setup)
```env
VITE_USE_FIREBASE_EMULATORS=true
```
- ✅ No internet needed
- ✅ No API keys needed
- ✅ Free forever
- ✅ Perfect for development
- ✅ Fast and simple

### Production Mode (When Ready to Deploy)
```env
VITE_USE_FIREBASE_EMULATORS=false
```
- ☁️ Uses real Firebase Cloud
- 🔑 Requires real API keys
- 💰 Has free tier, then paid
- 🌍 Accessible from anywhere

**To switch:** Just change the flag in `.env` and restart!

---

## 📝 Next Steps

1. ✅ Run emulators: `npm run emulators`
2. ✅ Run app: `npm run dev`
3. ✅ Test signup/login
4. ✅ Test all features:
   - CBT Questionnaires
   - Neurobic Exercises
   - AI Chatbots
   - Mood Detector
   - Appointments

---

## 🎉 Benefits of This Setup

✅ **No Cloud Dependencies** - Everything runs on your machine
✅ **No API Keys Needed** - Use dummy values
✅ **Fast Development** - No network latency
✅ **Free Forever** - No usage limits
✅ **Easy Testing** - Reset data anytime
✅ **Privacy** - Data never leaves your computer
✅ **Offline Development** - Work without internet

---

## 💡 Pro Tips

1. **Keep Emulator UI open** (http://localhost:4000) to watch data changes in real-time

2. **Use separate terminals** - One for emulators, one for dev server

3. **Create test accounts** with simple emails:
   - test@test.com
   - user@test.com
   - demo@test.com

4. **Reset anytime** by deleting `.firebase/` folder

5. **Check console logs** - App shows which mode it's running in

---

## 🆘 Need Help?

If you see in browser console:
- ✅ **"🔧 Running in LOCAL mode"** - Perfect! Using emulators
- ❌ **"☁️ Running in CLOUD mode"** - Check `.env` file

If emulators won't start:
- Check no other apps using ports 4000, 8080, 9099
- Run: `npx kill-port 4000 8080 9099`
- Try again: `npm run emulators`

---

**You're all set! Start the emulators and your app, then enjoy 100% local development! 🎊**

