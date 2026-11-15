# English with Sudan Sir – පන්ති කළමනාකරණ පද්ධතිය
Powered by NEXORA TECHNOLOGY

## ෆයිල්
- `public/index.html` – යෙදුම
- `public/cloud.js` – Firestore සමමුහුර්තය + login
- `public/firebase-config.js` – **ඔබේ Firebase config මෙහි ඇලවන්න**
- `firestore.rules` – **ඔබේ ඊමේල් මෙහි ඇතුළත් කරන්න**
- `firebase.json`, `.firebaserc`, `.github/workflows/firebase-hosting.yml`

## පියවර
1. **Authentication**: Firebase Console → Build → Authentication → Sign-in method → **Email/Password** සක්‍රිය කරන්න. Users ටැබයෙන් ඔබේ (සහ සහායකයින්ගේ) ගිණුම් සාදන්න.
2. **Config**: Project settings → Your apps → Web app (</>) එකක් සාදා ලැබෙන `firebaseConfig` අගයන් `public/firebase-config.js` හි ඇලවන්න.
3. **Rules**: `firestore.rules` හි `YOUR-EMAIL@gmail.com` වෙනුවට ඔබ සෑදූ ගිණුම්වල ඊමේල් ලියන්න.
4. `.firebaserc` සහ `.github/workflows/firebase-hosting.yml` හි `YOUR-FIREBASE-PROJECT-ID` මාරු කරන්න.
5. Deploy:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,hosting
   ```
6. GitHub: `git init && git add . && git commit -m "init" && git branch -M main && git remote add origin <repo-url> && git push -u origin main`, ඉන්පසු `firebase init hosting:github` එක් වරක් ධාවනය කරන්න (ස්වයංක්‍රීය deploy සඳහා).

## ක්‍රියාකාරිත්වය
- Login වූ පසු දත්ත Firestore (`cfg`, `students`, `att`, `fees` collections) සමඟ ස්වයංක්‍රීයව සමමුහුර්ත වේ.
- පළමු වරට cloud එක හිස් නම් මෙම උපාංගයේ දත්ත උඩුගත වේ. cloud එකේ දත්ත ඇත්නම් ඒවා ගනී (පැරණි local දත්ත `esk_backup` ලෙස සුරැකේ).
- ඕෆ්ලයින් වුවත් වැඩ කරයි; අන්තර්ජාලය ලැබුණු විට සමමුහුර්ත වේ.
- `firebase-config.js` සකසා නැත්නම් පද්ධතිය පෙර පරිදි local-only ලෙස ක්‍රියා කරයි.
