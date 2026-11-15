# English with Sudan Sir – පන්ති කළමනාකරණ පද්ධතිය
Powered by NEXORA TECHNOLOGY

## ෆෝල්ඩර් ව්‍යුහය
```
index.html              ← පද්ධතිය (root හි)
cloud.js                ← Firestore සමමුහුර්තය + login
firebase-config.js      ← ඔබේ Firebase config මෙහි
firestore.rules         ← Firestore ආරක්ෂක නීති (ඔබේ ඊමේල් මෙහි)
firebase.json           ← Hosting + Rules සැකසුම්
.firebaserc             ← Firebase Project ID
.github/workflows/      ← GitHub → Firebase ස්වයංක්‍රීය deploy
```

## සැකසීම
1. `firebase-config.js` හි `YOUR-...` අගයන් ඔබේ Firebase web app config එකෙන් ප්‍රතිස්ථාපනය කරන්න.
2. `firestore.rules` හි `YOUR-EMAIL@gmail.com` වෙනුවට Authentication හි සෑදූ ඊමේල් ලියන්න.
3. `.firebaserc` සහ `.github/workflows/firebase-hosting.yml` හි `YOUR-FIREBASE-PROJECT-ID` මාරු කරන්න.
4. Firebase Console → Authentication → **Email/Password** සක්‍රිය කර users සාදන්න.

## Deploy
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,hosting
```
GitHub ස්වයංක්‍රීය deploy සඳහා එක් වරක්: `firebase init hosting:github`
