# English with Sudan Sir – පන්ති කළමනාකරණ පද්ධතිය

Powered by NEXORA TECHNOLOGY

## ෆෝල්ඩර් ව්‍යුහය
- `public/index.html` – සම්පූර්ණ යෙදුම (එක ෆයිල් එකක්)
- `firebase.json`, `.firebaserc` – Firebase Hosting සැකසුම්
- `.github/workflows/firebase-hosting.yml` – GitHub වෙත push කළ විට ස්වයංක්‍රීයව deploy

## 1. Firebase project එක සාදන්න
1. https://console.firebase.google.com → **Add project**
2. Project ID එක සටහන් කරගන්න (උදා: `sudan-sir-classes`)
3. `.firebaserc` සහ `.github/workflows/firebase-hosting.yml` හි `YOUR-FIREBASE-PROJECT-ID` ඔබේ Project ID එකට මාරු කරන්න

## 2. පළමු වරට deploy (පරිගණකයෙන්)
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```
ඉන්පසු `https://<project-id>.web.app` හි පද්ධතිය පෙනේ.

## 3. GitHub වෙත යවන්න
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<ඔබේ-නම>/english-with-sudan-sir.git
git push -u origin main
```
(GitHub හි මුලින් හිස් repository එකක් සාදන්න.)

## 4. GitHub → Firebase ස්වයංක්‍රීය deploy
repository folder එකේ මෙය එක් වරක් ධාවනය කරන්න:
```bash
firebase init hosting:github
```
එය `FIREBASE_SERVICE_ACCOUNT` secret එක GitHub හි ස්වයංක්‍රීයව එක් කරයි. ඉන්පසු `main` එකට push කරන සෑම වාරයකම site එක යාවත්කාලීන වේ.

## සටහන
දත්ත (ශිෂ්‍යයන්, පැමිණීම්, ගාස්තු) ගබඩා වන්නේ එක් එක් උපාංගයේ බ්‍රවුසරයේ (localStorage) ය. Firebase Hosting මගින් සිදුවන්නේ පද්ධතිය web එකේ තැබීම පමණි. උපාංග කිහිපයක් අතර දත්ත බෙදාගැනීමට Firestore සම්බන්ධ කළ යුතුය.
