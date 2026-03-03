# HelpSeeker PWA Test

Simple Progressive Web App to test local speech recognition with Whisper AI.

## What This Tests

- PWA installation on iPhone/iPad
- Offline speech recognition using Whisper (runs entirely on device)
- Multi-language support (German, English, Spanish)
- Help-seeking phrase detection

## How to Test on iPhone/iPad

### Option 1: Local Server (Recommended)

1. **Start a local server** in this directory:
```bash
# If you have Python 3
python3 -m http.server 8080

# If you have Node.js
npx serve .

# If you have PHP
php -S localhost:8080
```

2. **On your iPhone/iPad**:
   - Make sure your phone is on the **same WiFi network** as your computer
   - Find your computer's IP address: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Open Safari and go to: `http://YOUR_COMPUTER_IP:8080`
   - Example: `http://192.168.1.100:8080`

3. **Install as PWA**:
   - Tap the **Share** button (square with arrow)
   - Scroll down and tap **"Add to Home Screen"**
   - Tap "Add"
   - The app now appears on your home screen!

4. **Test**:
   - Open the app from home screen (it launches fullscreen)
   - Tap "Load Model" (downloads ~39MB, one-time)
   - Wait for "Model loaded!"
   - Tap "Hold to Record" and speak
   - Try saying "Ich brauche Hilfe" (German) or "I need help" (English)

### Option 2: Deploy to GitHub Pages (Public)

1. Push this folder to a GitHub repository
2. Go to Settings → Pages → Source: Deploy from branch → Select main
3. Your app will be at: `https://yourusername.github.io/repo-name/`
4. Open on iPhone/iPad and install from there

### Option 3: Local File (Limited)

You can open `index.html` directly in Safari, but:
- Service Worker won't work (can't install as PWA)
- Microphone might be blocked
- Best for quick testing only

## Testing Features

1. **Model Loading**:
   - Downloads Whisper "tiny" model (39MB instead of 150MB)
   - Shows progress bar during download
   - Stored in browser cache (persists across sessions)

2. **Speech Recognition**:
   - Tap "Hold to Record" → Speak → Tap again to stop
   - Audio is transcribed locally using Whisper AI
   - No data sent to any server (100% private)
   - Works offline after initial model download

3. **Language Support**:
   - Select language before recording
   - German (priority), English, Spanish
   - Whisper auto-detects but we hint the language

4. **Phrase Matching**:
   - Detects help-seeking phrases
   - Shows match status after transcription

## Troubleshooting

**"Microphone access denied"**:
- iOS Settings → Safari → Microphone → Allow
- Or look for microphone icon in address bar

**"Error loading model"**:
- Check internet connection (model downloads from CDN)
- Try refreshing the page
- Check browser console for details

**App not showing install prompt**:
- Must be served over HTTPS or localhost
- Safari requires user interaction before showing prompt
- Try the "Install App" button that appears

**Slow transcription**:
- First transcription is slow (model warming up)
- Subsequent transcriptions are faster
- Older devices will be slower (iPad 2018+ recommended)

## Where is the Model Stored?

The Whisper AI model is **NOT** stored in your server folder. It's cached by the browser on each device:

- **Location**: Browser's IndexedDB or Cache Storage (device-specific)
- **Size**: ~39MB per device that loads it
- **Persistence**: Survives browser restarts, cleared if user clears site data
- **Per-device**: Each iPhone/iPad/computer downloads its own copy
- **Server**: Your server just hosts the HTML/CSS/JS files (small, ~20KB total)

To clear and re-download: Safari Settings → Clear History and Website Data

## File Structure

```
pwa-test/
├── index.html          # Main app with Whisper integration
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline caching
├── icon-192x192.png    # App icons
├── icon-512x512.png
└── README.md
```

## Next Steps

If this works well, we can expand with:
- Full scenario gameplay
- User profiles
- Progress tracking (IndexedDB)
- Character selection
- Educational reward games
- Data export/import

## Technical Details

- **Whisper Model**: Xenova/whisper-tiny (39MB, quantized)
- **Library**: Transformers.js (ONNX runtime in browser)
- **Browser Support**: Safari iOS 14+, Chrome, Edge
- **Offline**: Yes, after initial model load
- **Privacy**: All processing on device

## Cost

- **Free**: Whisper runs locally, no API keys needed
- **No server required**: Can host on any static file host
- **No Apple Developer fee**: PWA bypasses App Store entirely
