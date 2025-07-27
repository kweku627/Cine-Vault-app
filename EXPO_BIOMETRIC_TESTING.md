# 🔐 Testing Biometric Authentication in Expo

## 🚀 **Setup Options**

### **Option 1: Development Build (Recommended)**
For full biometric functionality, create a development build:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS Build
eas build:configure

# Create development build
eas build --profile development --platform android
# or
eas build --profile development --platform ios
```

### **Option 2: Expo Go (Limited Testing)**
For testing with Expo Go, the app now includes simulation mode.

## 🧪 **Testing Steps**

### **1. Enable Biometric Authentication**
1. Open the app
2. Go to **Settings**
3. Find **"Biometric Authentication"**
4. Tap to enable it
5. Enable **"Require Biometric on App Launch"**

### **2. Test the Flow**
1. **Log out** of the app
2. **Log back in** with your credentials
3. You should see the **Biometric Authentication screen**
4. The biometric prompt should appear **automatically**

### **3. Manual Testing**
If automatic triggering doesn't work:
1. Use the **"Test Biometric (Expo)"** button
2. This will manually trigger the biometric authentication

## 🔍 **Debug Information**

### **Console Logs to Check**
Look for these logs in your console:

```
AuthContext - Biometric required setting: true
AuthRedirector - Authenticated but needs biometric, redirecting to /biometric-auth
BiometricAuthScreen - Mounted with states: {...}
```

### **Expected States**
- `biometricRequired: true` ✅
- `biometricEnabled: true` ✅
- `biometricAvailable: true` ✅
- `biometricAuthenticated: false` ✅ (initially)

## 🐛 **Troubleshooting**

### **If biometric doesn't appear automatically:**
1. Check if "Require Biometric on App Launch" is enabled
2. Try the manual test button
3. Check console logs for debugging info

### **If using Expo Go:**
- Biometric will be simulated (1-second delay)
- Look for "Simulated Biometrics (Expo Go)" in logs
- Use the test button to verify functionality

### **If using Development Build:**
- Real biometric authentication will work
- Device must have biometric hardware
- User must have biometric credentials enrolled

## 📱 **Platform-Specific Notes**

### **Android**
- Requires fingerprint sensor or face recognition
- User must have biometric credentials set up in device settings

### **iOS**
- Requires Touch ID or Face ID
- User must have biometric credentials set up in device settings

### **Web (Expo Go)**
- Simulated mode only
- No real biometric authentication

## ✅ **Success Indicators**

When working correctly, you should see:
1. Biometric authentication screen appears after login
2. Biometric prompt appears automatically
3. After successful authentication, you're taken to the main app
4. Each app launch requires biometric authentication (if enabled)

---

**Note**: For production apps, always use Development Builds for biometric authentication. 