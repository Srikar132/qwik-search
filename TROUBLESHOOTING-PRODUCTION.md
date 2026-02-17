# Production Build Troubleshooting Guide

## Issue: Loading Loop with No Response

### Root Cause
The Puter AI SDK loaded from CDN (`https://js.puter.com/v2/`) may not be loading properly in the packaged Electron app due to:
1. Content Security Policy (CSP) restrictions
2. Network connectivity issues
3. SDK initialization timing problems

### Fixes Applied

#### 1. Added SDK Availability Check
- Added polling mechanism to wait for Puter SDK to load (up to 5 seconds)
- Added explicit error message if SDK fails to load
- Added console logging for debugging

#### 2. Updated Content Security Policy
- Added CSP meta tag in `index.html` to allow Puter SDK domains
- Added CSP headers in Electron main process via `webRequest.onHeadersReceived`
- Allowed:
  - Script loading from `https://js.puter.com`
  - Connections to `https://*.puter.com` and `wss://*.puter.com`

#### 3. Enhanced Error Handling
- Check if `window.puter` and `window.puter.ai` exist before making API calls
- Display clear error messages to users
- Log SDK status to console

### How to Test the Fix

#### 1. Rebuild the Application
```powershell
# Clean previous builds
Remove-Item -Recurse -Force dist, dist-electron, release -ErrorAction SilentlyContinue

# Build the app
npm run build
npm run build:electron

# Package for Windows
npm run package:win
```

#### 2. Install the New Build
- Uninstall the previous version if installed
- Install the new `.exe` from the `release` folder
- Run the application

#### 3. Enable Dev Tools in Production (for debugging)
If you still face issues, temporarily enable DevTools in production:

Edit `electron/main.ts`:
```typescript
if (isDev) {
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.webContents.openDevTools({ mode: 'detach' });
} else {
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  mainWindow.webContents.openDevTools({ mode: 'detach' }); // Add this line
}
```

Then rebuild and check the Console tab for errors.

### Check Console Logs

When you open DevTools, you should see:
1. `Puter SDK is ready` - SDK loaded successfully
2. `Starting streaming chat with query: [your query]` - API call started
3. `Puter SDK status: { hasPuter: true, hasAI: true }` - SDK structure verified
4. `Streaming complete. Total length: [number]` - Response received

### Common Errors and Solutions

#### Error: "Puter AI SDK is not loaded"
**Cause**: SDK script failed to load from CDN
**Solution**: 
- Check internet connection
- Verify firewall isn't blocking `js.puter.com`
- Check if antivirus is blocking the connection

#### Error: "Failed to get response" or Network Error
**Cause**: API endpoint is blocked or unreachable
**Solution**:
- Check if `puter.com` is accessible from your network
- Try disabling VPN if active
- Check corporate firewall settings

#### Loading Spinner Stays Forever
**Cause**: 
1. SDK loaded but API call hanging
2. Network timeout
3. WebSocket connection failed

**Solution**:
1. Check console for errors
2. Verify internet connection is stable
3. Try a simpler query like "Hello"

### Alternative: Bundle SDK Locally (Advanced)

If CDN loading continues to fail, you can bundle the Puter SDK locally:

1. Download the SDK:
```powershell
Invoke-WebRequest -Uri "https://js.puter.com/v2/" -OutFile "public/puter-sdk.js"
```

2. Update `index.html`:
```html
<script src="/puter-sdk.js"></script>
```

3. Rebuild and package

### Network Requirements

The application needs access to:
- `js.puter.com` (HTTPS) - SDK download
- `puter.com` (HTTPS) - API endpoints
- `*.puter.com` (HTTPS/WSS) - WebSocket streaming

Ensure these domains are not blocked by:
- Firewall
- Antivirus
- Proxy
- VPN
- Corporate network policies

### Testing Checklist

- [ ] Internet connection is active
- [ ] Firewall allows Electron app
- [ ] No antivirus blocking
- [ ] Previous version uninstalled
- [ ] Fresh install of new build
- [ ] DevTools show no console errors
- [ ] "Puter SDK is ready" appears in console
- [ ] Simple query like "test" works

### If Issues Persist

1. **Enable DevTools in production** (see above)
2. **Take screenshot of Console errors**
3. **Check Network tab** in DevTools to see if SDK loads
4. **Try running in development mode**: `npm run electron:dev`
   - If it works in dev but not production, it's a packaging issue
   - If it fails in both, it's a network/SDK issue

### Get More Help

If none of these solutions work:
1. Check the Console tab in DevTools for specific error messages
2. Check the Network tab to see which requests are failing
3. Look for error messages in the application UI
