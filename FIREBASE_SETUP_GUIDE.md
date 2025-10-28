# 🔥 Firebase API Key Setup Guide

## ⚠️ Issue: "api-key-not-valid.-please-pass-a-valid-api-key"

This error occurs because the Firebase environment variables are not configured. After upgrading to Firebase v11, we need to set up your Firebase credentials.

---

## 🔧 Quick Fix (5 minutes)

### Step 1: Get Your Firebase Credentials

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Select your project (or create a new one if needed)
3. Click the **Settings gear icon** (⚙️) → **Project Settings**
4. Scroll down to **"Your apps"** section
5. If you don't have a web app yet:
   - Click **"Add app"** → Select **Web** (`</>` icon)
   - Register your app with a nickname (e.g., "EmotionX Web")
   - Click **"Register app"**
6. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

### Step 2: Create `.env` File

Create a new file named **`.env`** in your project root (same folder as `package.json`):

#### Option A: Using Command Line
```bash
# In PowerShell
notepad .env
```

#### Option B: Using VS Code
1. Right-click in File Explorer → New File
2. Name it `.env` (exactly, with the dot)
3. Open it in VS Code

---

### Step 3: Add Your Firebase Configuration

Copy this template into your `.env` file and **replace the values** with your actual Firebase credentials:

```env
# Firebase Configuration
VITE_APP_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_APP_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_APP_PROJECT_ID=your-project-id
VITE_APP_STORAGE_BUCKET=your-project.appspot.com
VITE_APP_MESSAGING_SENDER_ID=123456789012
VITE_APP_APP_ID=1:123456789012:web:abcdef1234567890
```

**⚠️ Important:**
- No quotes around values
- No spaces around the `=` sign
- Replace ALL placeholder values with your actual Firebase config

---

### Step 4: Restart Development Server

After creating the `.env` file:

```bash
# Stop the current dev server (Ctrl+C)

# Start it again
npm run dev
```

**The server MUST be restarted** for environment variables to load!

---

## ✅ Verification

After restarting, test the signup:

1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill in the form
4. If configured correctly, you should be able to create an account

---

## 🔒 Security Notes

✅ **Good News:**
- The `.env` file is already in `.gitignore`
- Your credentials won't be committed to Git
- These are **public** API keys (safe for client-side)

⚠️ **Remember:**
- Never share your `.env` file
- Never commit it to a public repository
- Firebase API keys are restricted by domain in Firebase Console

---

## 🚨 Common Mistakes

### ❌ Wrong:
```env
VITE_APP_API_KEY="your-key-here"  # Don't use quotes
VITE_APP_API_KEY = your-key-here  # No spaces
apiKey=your-key-here              # Wrong variable name
```

### ✅ Correct:
```env
VITE_APP_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 📋 Troubleshooting

### Issue: Still getting API key error after setup

**Solution:**
1. Verify `.env` file is in the **root directory** (same level as `package.json`)
2. Verify variable names start with `VITE_APP_` (not just `FIREBASE_`)
3. **Restart the dev server** (Ctrl+C, then `npm run dev`)
4. Clear browser cache and reload

---

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Solution:**
1. Double-check you copied the **entire** API key from Firebase Console
2. Make sure there are no extra spaces or newlines
3. Verify the API key in Firebase Console is enabled

---

### Issue: Can't create `.env` file in Windows

**Solution:**

#### Method 1: PowerShell
```powershell
New-Item -Path .env -ItemType File
notepad .env
```

#### Method 2: Command Prompt
```cmd
type nul > .env
notepad .env
```

#### Method 3: VS Code Terminal
```bash
touch .env
code .env
```

---

## 🎯 Complete `.env` Template

Here's the complete template with explanations:

```env
# ====================================
# Firebase Configuration
# ====================================
# Get these from Firebase Console:
# https://console.firebase.google.com/ > Project Settings

# Your Firebase API Key (starts with AIzaSy...)
VITE_APP_API_KEY=your-api-key-here

# Your project's Auth Domain (ends with .firebaseapp.com)
VITE_APP_AUTH_DOMAIN=your-project.firebaseapp.com

# Your Firebase Project ID
VITE_APP_PROJECT_ID=your-project-id

# Your Storage Bucket (ends with .appspot.com)
VITE_APP_STORAGE_BUCKET=your-project.appspot.com

# Your Messaging Sender ID (numbers only)
VITE_APP_MESSAGING_SENDER_ID=123456789012

# Your Firebase App ID (starts with 1:...)
VITE_APP_APP_ID=1:123456789012:web:abcdef1234567890
```

---

## 🔍 How to Verify `.env` is Loaded

Add this temporarily to your `src/firebase.js` to check:

```javascript
console.log('Firebase Config Check:', {
  hasApiKey: !!import.meta.env.VITE_APP_API_KEY,
  apiKeyLength: import.meta.env.VITE_APP_API_KEY?.length || 0,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN
});
```

If you see `hasApiKey: false`, the `.env` file isn't being loaded.

---

## 📞 Need More Help?

If you're still stuck:

1. **Check the file exists:**
   ```bash
   ls -la .env
   ```

2. **View the content (without showing sensitive data):**
   ```bash
   cat .env | head -1
   ```
   Should show: `# Firebase Configuration`

3. **Verify environment is loading:**
   In browser console (F12), check if variables exist:
   ```javascript
   console.log(import.meta.env)
   ```

---

## ✨ Once Working

After successful setup:
- ✅ Signup/Login will work
- ✅ Firestore database will connect
- ✅ All features will be accessible
- ✅ You can proceed with full testing

**Remember:** The `.env` file is already in `.gitignore` and won't be tracked by Git! 🔒

