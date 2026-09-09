Class Attendance & Fee Management System
==========================================

ගොනු විස්තරය (File Details):
----------------------------
1. index.html       - Attendance Scanner (QR Code එක Scan කර පැමිණීම සටහන් කිරීම සහ WhatsApp පණිවිඩය සකස් කිරීම)
2. register.html    - ශිෂ්‍යයන් ලියාපදිංචි කිරීමේ පිටුව (Student ID, Name, Phone, Initial Fee Status)
3. qr_generator.html- ශිෂ්‍ය ID සඳහා QR Codes Generate කර Print කරගැනීම
4. admin_fees.html   - ශිෂ්‍යයන්ගේ මාසික පන්ති ගාස්තු Status (Paid / Pending) Update කිරීම

භාවිතය සඳහා පියවර (Setup Steps):
-------------------------------
1. Firebase Console (https://firebase.google.com/) වෙත ගොස් Realtime Database එකක් සාදන්න.
2. සෑම HTML File එකකම ඇති 'firebaseConfig' කොටසෙහි ඔබේ Firebase Project Credentials (API Key, Database URL, ආදිය) ඇතුළත් කරන්න.
3. මෙම සියලුම HTML Files GitHub Repository එකකට Upload කර GitHub Pages හරහා Host කරගන්න.
