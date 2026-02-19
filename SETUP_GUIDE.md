# Setup Guide - Fixing Missing Data Issue

## Problem Summary

Your UI is running but showing no data because:

1. **Missing Firebase environment variables** - The app can't connect to Firebase
2. **Empty database** - No data has been seeded into Firestore

## Solution Steps

### Step 1: Create Environment Variables File

Create a file named `.env.local` in the root of your project (`/Users/deadshot/Desktop/Code/employee-management/.env.local`) with the following content:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCyU-rt0P7_mezRXk0C_68X7OLRSm_UMBE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=employee-management-syst-9f4bd.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=employee-management-syst-9f4bd
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=employee-management-syst-9f4bd.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=949708868685
NEXT_PUBLIC_FIREBASE_APP_ID=1:949708868685:web:1e6a8d42f164fe80b2a004
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-990PD9BN1G
```

**Important**: After creating this file, **restart your Next.js dev server** for the environment variables to be loaded.

### Step 2: Update Firestore Security Rules

**⚠️ IMPORTANT**: Before seeding, you need to update your Firestore security rules to allow read/write access.

See `FIRESTORE_RULES_FIX.md` for detailed instructions. Quick steps:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `employee-management-syst-9f4bd`
3. Go to Firestore Database → Rules
4. Replace rules with (development only):

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

5. Click "Publish"

### Step 3: Seed the Database

Run the seeder script to populate your Firestore database with initial data:

```bash
# Navigate to the seeder directory
cd seeder

# Install dependencies (if not already done)
npm install

# Build the TypeScript files
npm run build

# Run the seeder
npm run seed
```

Or if you have `ts-node` installed globally:

```bash
cd seeder
ts-node src/index.ts
```

This will populate your database with:

- Sample employees
- Sample payroll records
- Sample attendance records
- Department configurations

### Step 4: Verify the Setup

1. **Restart your Next.js dev server**:

   ```bash
   npm run dev
   ```

2. **Check the browser console** for any Firebase errors

3. **Visit your app** - You should now see data in:
   - Employees page (`/employees`)
   - Attendance page (`/attendance`)
   - Payroll page (`/payroll`)

### Step 5: Verify Firestore Security Rules

Make sure your Firestore security rules allow read/write access. In Firebase Console:

1. Go to Firestore Database → Rules
2. For development, you can use:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

3. **⚠️ WARNING**: This is permissive and only for development. Set proper rules for production!

## Troubleshooting

### Still No Data?

1. **Check browser console** for errors:
   - Open DevTools (F12)
   - Look for Firebase initialization errors
   - Check Network tab for failed Firebase requests

2. **Verify environment variables are loaded**:
   - Add a temporary `console.log` in `src/config/firebase.ts`:

     ```typescript
     console.log('Firebase Config:', {
       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
       // ... other vars
     });
     ```

3. **Check Firebase Console**:
   - Go to <https://console.firebase.google.com>
   - Select your project: `employee-management-syst-9f4bd`
   - Go to Firestore Database
   - Verify collections exist: `employees`, `attendance`, `payrolls`, `config`

4. **Verify seeder ran successfully**:
   - Check the console output when running the seeder
   - Should see messages like "Added employee: John Doe"

### Firebase Connection Errors

If you see errors like "Firebase: Error (auth/network-request-failed)":

1. Check your internet connection
2. Verify Firebase project is active in Firebase Console
3. Check if Firestore is enabled in your Firebase project

### Environment Variables Not Loading

1. Make sure the file is named exactly `.env.local` (not `.env.local.txt`)
2. Restart the Next.js dev server after creating the file
3. Variables must start with `NEXT_PUBLIC_` to be accessible in the browser

## Next Steps

After fixing the data issue:

1. ✅ Test all CRUD operations (Create, Read, Update, Delete)
2. ✅ Verify data persists after page refresh
3. ⚠️ Set up proper Firestore security rules for production
4. ⚠️ Consider adding error boundaries for better error handling
5. ⚠️ Add loading states and empty state messages
