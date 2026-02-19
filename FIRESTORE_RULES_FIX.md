# Firestore Security Rules Fix

## Issue
The seeder failed with error: `Missing or insufficient permissions`

This means your Firestore security rules are blocking read/write access.

## Quick Fix (Development Only)

You need to update your Firestore security rules in the Firebase Console:

### Steps:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `employee-management-syst-9f4bd`

2. **Navigate to Firestore Rules**
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Rules" tab

3. **Update the Rules**
   - Replace the existing rules with this (for development only):

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

4. **Publish the Rules**
   - Click "Publish" button
   - Wait a few seconds for the rules to update

5. **Run the Seeder Again**
   ```bash
   cd seeder
   npm run seed
   ```

## ⚠️ Security Warning

The rules above (`allow read, write: if true`) are **completely permissive** and should **ONLY be used for development**. 

For production, you should implement proper security rules that:
- Authenticate users
- Validate data
- Restrict access based on user roles
- Use proper field validation

## Production-Ready Rules Example

Once you're ready for production, consider rules like:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Employees collection
    match /employees/{employeeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Payrolls collection
    match /payrolls/{payrollId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Config collection
    match /config/{configId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## After Fixing Rules

Once you've updated the rules, run the seeder again:

```bash
cd seeder
npm run seed
```

You should see output like:
```
Seeding employees...
Added employee: John Doe
Added employee: Jane Smith
...
All data seeded successfully!
```

