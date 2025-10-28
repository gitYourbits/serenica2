# Firebase Environment Setup Script
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Firebase Environment Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "❌ Canceled. Keeping existing .env file." -ForegroundColor Red
        exit
    }
}

Write-Host "📝 Creating .env file..." -ForegroundColor Green
Write-Host ""

# Get Firebase credentials from user
Write-Host "Please enter your Firebase credentials:" -ForegroundColor Yellow
Write-Host "(Get these from: https://console.firebase.google.com/ > Project Settings)" -ForegroundColor Gray
Write-Host ""

$apiKey = Read-Host "API Key (starts with AIzaSy...)"
$authDomain = Read-Host "Auth Domain (ends with .firebaseapp.com)"
$projectId = Read-Host "Project ID"
$storageBucket = Read-Host "Storage Bucket (ends with .appspot.com)"
$messagingSenderId = Read-Host "Messaging Sender ID (numbers only)"
$appId = Read-Host "App ID (starts with 1:...)"

# Create .env file
$envContent = @"
# Firebase Configuration
# Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

VITE_APP_API_KEY=$apiKey
VITE_APP_AUTH_DOMAIN=$authDomain
VITE_APP_PROJECT_ID=$projectId
VITE_APP_STORAGE_BUCKET=$storageBucket
VITE_APP_MESSAGING_SENDER_ID=$messagingSenderId
VITE_APP_APP_ID=$appId
"@

$envContent | Out-File -FilePath .env -Encoding utf8

Write-Host ""
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Stop your dev server (Ctrl+C) if it's running" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Try signing up again" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Restart the dev server for changes to take effect!" -ForegroundColor Yellow
Write-Host ""

