# Alpha Advisors — Digital Identity

## الفكرة
- الصفحة الرئيسية (`#/`) بتعرض **QR فقط** — ده اللي بيتطبع على الكارت.
- لما حد يسكان الكارت → يفتح `#/profile/<slug>` → شاشة ترحيب 5 ثواني "Welcome to <Name>'s Profile" → البروفايل بالأنيميشن.

## التشغيل
1. `npm install`
2. `npm run dev`

## إضافة / تعديل موظف
عدّل `src/data/employee.js` (كل موظف له slug). صفحة الـ QR الخاصة بيه: `#/qr/<slug>`.

## النشر (GitHub Pages)
ارفع المشروع على GitHub ثم Settings → Pages → Source: GitHub Actions. بعد ما يخلص النشر:
1. افتح `https://<user>.github.io/<repo>/#/qr/ahmed-mohamed` **من الرابط المنشور** (مش localhost).
2. حمّل الـ QR (PNG أو SVG) واطبعه على الكارت.
3. جرّب سكان من موبايل قبل الطباعة.

> لو الدومين اتغيّر، حط الرابط الجديد في `SITE_URL` جوه `src/data/employee.js` وأعد توليد الـ QR.
