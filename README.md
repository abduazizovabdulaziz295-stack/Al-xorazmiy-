# 🎓 Maktab CRM Tizimi (School Management System)

Zamonaviy, xavfsiz va estetik jihatdan juda go'zal **Maktab CRM Tizimi**. Tizim ultra-zamonaviy Glassmorphism dizayni, ambient orqa fon effektlari va to'liq interaktiv boshqaruv imkoniyatlariga ega.

---

## 🔐 Kirish Ma'lumotlari (Autentifikatsiya)
- **Login**: `admin`
- **Parol**: `12345`

> Sahifada qulaylik uchun **"Tezkor to'ldirish (Quick Fill)"** tugmasi mavjud bo'lib, bir bosishda login va parolni avtomatik to'ldirib beradi.

---

## 🌟 Asosiy Imkoniyatlar va Funksiyalar

1. **Kirish Tizimi (Authentication)**:
   - Shaffof (Glassmorphic) kirish kartasi.
   - Parolni ko'rsatish / yashirish (ko'zcha belgisi).
   - "Eslab qolish" (Remember me) tizimi.
   - Noto'g'ri login/parolda dinamik tebranish (shake) va xatolik xabari.

2. **Boshqaruv Paneli (Dashboard)**:
   - Jonli Toshkent soati va sanasi.
   - Asosiy ko'rsatkichlar (Jami o'quvchilar, O'qituvchilar, Bugungi davomat, Oylik to'lov tushumi).
   - Interaktiv grafiklar (Chart.js): Haftalik davomat tahlili va Fan yo'nalishlari taqsimoti.
   - So'nggi faoliyatlar lentasi.

3. **O'quvchilar Boshqaruvi (Students CRUD)**:
   - O'quvchilar to'liq ma'lumotlar bazasi.
   - Ism, telefon yoki ota-onasi bo'yicha tezkor qidiruv.
   - Sinflar va to'lov holati bo'yicha saralash (filtr).
   - Yangi o'quvchi qo'shish, ma'lumotlarni tahrirlash va o'chirish.
   - Barcha o'quvchilar ro'yxatini **Excel / CSV** formatida yuklab olish.

4. **O'qituvchilar Jamoasi (Teachers Management)**:
   - Malakali ustozlar kartochkalari.
   - Fanlar, ish staji, oylik maosh va biriktirilgan sinflar nazorati.
   - Yangi o'qituvchi qo'shish va fanlar bo'yicha filter.

5. **Sinflar va Dars Jadvali (Classes & Timetable)**:
   - Har bir sinf (11-A, 10-B, 9-A...) uchun alohida karta.
   - Interaktiv haftalik dars jadvali (Dushanba - Shanba).

6. **To'lovlar & Moliya (Finance)**:
   - Tushumlar, to'langan summalar va qarzdorlik tahlili.
   - Yangi to'lov qabul qilish (Click, Payme, Uzum Bank, Naqd, Bank).
   - Rasmiy to'lov kvitansiyasini chiqarish va chop etish (Print Receipt).

7. **Davomat Nazorati (Attendance)**:
   - Tanlangan sinf bo'yicha davomat belgilash ("Bor", "Yo'q", "Sababli").
   - "Barchasini 'Bor' qilish" qulay tezkor tugmasi.
   - Davomat natijalarini saqlash.

8. **Sozlamalar & Xavfsizlik (Settings)**:
   - Maktab rekvizitlarini (nomi, direktor, telefon, manzil) o'zgartirish.
   - Tizim parolini yangilash (standart 12345 ni o'zgartirish).
   - Demo ma'lumotlarni boshlang'ich holatga qaytarish.
   - Mavzuni almashtirish (Qorong'i / Yorug' rejim).

9. **Ma'lumotlar Doimiyligi (LocalStorage Persistence)**:
   - Barcha kiritilgan yangi ma'lumotlar brauzer xotirasida saqlanadi, brauzerni qayta yuklaganda ham o'chib ketmaydi.

---

## 🚀 Ishga Tushirish
Hech qanday murakkab server talab qilinmaydi! Shunchaki loyiha papkasidagi **`index.html`** faylini istalgan brauzerda (Chrome, Edge, Firefox, Safari) ikki marta bosib oching.
