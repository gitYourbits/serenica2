# ⚡ Quick Fix: Firebase API Key Error

## The Problem
```
❌ api-key-not-valid.-please-pass-a-valid-api-key
```

## The Solution (Choose One)

### 🚀 Option 1: Automated Setup (Recommended)
```powershell
.\setup-env.ps1
```
Follow the prompts and enter your Firebase credentials.

---

### ✍️ Option 2: Manual Setup

**Step 1:** Create `.env` file in project root

**Step 2:** Add this content (replace with your actual values):
```env
VITE_APP_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_APP_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_APP_PROJECT_ID=your-project-id
VITE_APP_STORAGE_BUCKET=your-project.appspot.com
VITE_APP_MESSAGING_SENDER_ID=123456789012
VITE_APP_APP_ID=1:123456789012:web:abcdef1234567890
```

**Step 3:** Get your Firebase config from:
👉 https://console.firebase.google.com/
   → Project Settings → Your apps → Web app config

**Step 4:** Restart dev server
```bash
# Stop server: Ctrl+C
npm run dev
```

---

## 📍 Where to Get Firebase Credentials

1. Open https://console.firebase.google.com/
2. Select your project
3. Click ⚙️ (Settings) → **Project Settings**
4. Scroll to **"Your apps"**
5. Click **Web app** (or add one with `</>` button)
6. Copy all the config values

---

## ✅ Verification Checklist

- [ ] `.env` file exists in root folder (same level as `package.json`)
- [ ] All 6 variables are filled with actual values (not placeholders)
- [ ] No quotes around values (`VITE_APP_API_KEY=value`, not `"value"`)
- [ ] Dev server was **restarted** after creating `.env`
- [ ] Browser cache cleared and page refreshed

---

## 🎯 Expected Result

After setup:
- ✅ Signup works
- ✅ Login works
- ✅ No API key errors

---

## 📚 Need More Help?

See detailed guide: **`FIREBASE_SETUP_GUIDE.md`**

