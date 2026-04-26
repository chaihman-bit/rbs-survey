# RBS Store Survey System

**ระบบสำรวจร้านค้าสำหรับทีม RBS Vietnam**  
HTML Form · 3 ภาษา (EN / TH / VI) · Google Sheets · GitHub Pages

---

## สิ่งที่ได้ในระบบนี้

| ไฟล์ | คำอธิบาย |
|------|-----------|
| `index.html` | Survey form — ทีมใช้สำรวจหน้างาน |
| `google-apps-script.js` | Script รับข้อมูลเข้า Google Sheet |
| `README.md` | คู่มือนี้ |

**Google Sheet ที่ได้ (3 tabs อัตโนมัติ):**
- **Raw Data** — ข้อมูลดิบทุก field จากทุก submission
- **Summary** — คะแนนสรุปทุกร้าน พร้อม color-coding ตาม rating
- **Pipeline** — ร้านที่มี priority สำหรับทีมขาย

---

## ตั้งค่าทั้งหมดใน 3 ส่วน

### ส่วนที่ 1 — Google Sheet + Apps Script (~15 นาที)

**1.1 สร้าง Google Sheet**
1. ไปที่ [sheets.google.com](https://sheets.google.com) → สร้าง Spreadsheet ใหม่
2. ตั้งชื่อว่า `RBS Store Survey Data — Vietnam`
3. Copy **Spreadsheet ID** จาก URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

**1.2 ตั้งค่า Apps Script**
1. ใน Google Sheet → **Extensions → Apps Script**
2. ลบ code เดิมทั้งหมด
3. Copy code จากไฟล์ `google-apps-script.js` วางทั้งหมด
4. แก้บรรทัดนี้ด้วย ID ของคุณ:
   ```javascript
   const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
   ```
5. กด **Save** (Ctrl+S)

**1.3 ทดสอบ Script**
1. เลือก function `_test` จาก dropdown → กด **Run**
2. อนุญาต permissions (ครั้งแรกเท่านั้น)
3. ตรวจสอบ Google Sheet — ต้องมี 3 sheet และ 1 แถวข้อมูล TEST

**1.4 Deploy เป็น Web App**
1. คลิก **Deploy → New deployment**
2. ตั้งค่าดังนี้:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
3. คลิก **Deploy** → Copy **Web app URL**

> ⚠️ **ทุกครั้งที่แก้ code ต้อง Deploy ใหม่** (New deployment) — ไม่ใช่ Edit existing

---

### ส่วนที่ 2 — GitHub Pages (~10 นาที)

**2.1 สร้าง GitHub repository**
1. ไปที่ [github.com](https://github.com) → **New repository**
2. ตั้งชื่อ: `rbs-store-survey`
3. เลือก **Public**
4. กด **Create repository**

**2.2 Upload ไฟล์**
วิธีที่ง่ายที่สุด — ลาก & วาง:
1. เปิด repository → คลิก **Add file → Upload files**
2. ลาก `index.html` และ `README.md` ขึ้นไป
3. กด **Commit changes**

หรือใช้ Git (ถ้าคุ้นเคย):
```bash
git clone https://github.com/[username]/rbs-store-survey.git
cp index.html rbs-store-survey/
cd rbs-store-survey
git add .
git commit -m "Initial deploy"
git push
```

**2.3 เปิด GitHub Pages**
1. ไปที่ repository → **Settings** → **Pages** (sidebar)
2. Source: **Deploy from a branch**
3. Branch: **main** → folder: **/ (root)**
4. กด **Save**
5. รอ 2–3 นาที → ได้ URL:
   ```
   https://[your-username].github.io/rbs-store-survey/
   ```

---

### ส่วนที่ 3 — ใส่ GAS URL ใน Form

**วิธีที่ 1: ใส่ตอนใช้งาน (แนะนำสำหรับเริ่มต้น)**
- ทีมเปิด form → ส่วน ⚙ "Google Apps Script URL" → วาง URL → Submit

**วิธีที่ 2: ฝัง URL ในโค้ดถาวร (สะดวกกว่า)**

เปิดไฟล์ `index.html` ค้นหาบรรทัด:
```html
<input type="text" id="gasUrl" placeholder="https://script.google.com/...">
```
เปลี่ยนเป็น:
```html
<input type="text" id="gasUrl" value="https://script.google.com/macros/s/YOUR_ID/exec">
```
แล้ว commit ขึ้น GitHub — ทีมจะเห็น URL pre-filled ทุกครั้ง

---

## แชร์ให้ทีม

```
🔗 URL สำหรับทีม:
https://[username].github.io/rbs-store-survey/

วิธีใช้:
1. เปิด URL บน browser (มือถือ / tablet / laptop)
2. เลือกภาษา EN / TH / VI มุมขวาบน
3. กรอกข้อมูล 7 steps → Submit
4. ข้อมูลเข้า Google Sheet ทันที
```

---

## การแก้ไขในอนาคต

เมื่อต้องการเพิ่มหัวข้อหรือแก้ form:

1. แก้ไขไฟล์ `index.html` บน computer
2. Upload ขึ้น GitHub (drag & drop หรือ git push)
3. GitHub Pages อัปเดตอัตโนมัติภายใน 1–2 นาที
4. ทีมได้ version ใหม่ทันที — ไม่ต้องส่งไฟล์ใหม่

---

## Troubleshooting

| ปัญหา | วิธีแก้ |
|-------|---------|
| Submit แล้วไม่มีข้อมูลใน Sheet | ตรวจสอบ GAS URL ว่าถูกต้อง และ Deploy ด้วย access "Anyone" |
| CORS error ใน console | ปกติสำหรับ `no-cors` — ข้อมูลส่งไปแล้ว ตรวจใน Sheet โดยตรง |
| Script error ใน Apps Script | ดู **Executions** tab ใน Apps Script editor |
| GitHub Pages ไม่อัปเดต | รอ 5 นาที หรือ hard refresh (Ctrl+Shift+R) |
| ข้อมูลหายเมื่อปิด browser | กด Export JSON ก่อน หรือรอ auto-save 5 วินาที |

---

## โครงสร้าง Weighted Score

| Section | Weight | ความหมาย |
|---------|--------|-----------|
| Category & Planogram | 25% | มีผลต่อยอดขายโดยตรง |
| Visual Merchandising | 20% | ภาพรวมที่ลูกค้าสัมผัส |
| Store Flow & Layout | 15% | ประสบการณ์เดินร้าน |
| Shelf Quality | 15% | โอกาสขาย RBS ชั้นวาง |
| Entrance & Signage | 8% | การมองเห็นจากนอก |
| Special Display | 10% | โอกาสขาย RBS display |
| Checkout Zone | 4% | จุด impulse buying |
| Refrigeration | 3% | Cold chain opportunity |

**Rating:** Excellent ≥ 4.5 · Good 3.5–4.4 · Fair 2.5–3.4 · Poor < 2.5

---

*RBS Retail Business Solution — Store Survey System v3.0*  
*Supports EN / TH / VI · Mobile-first · Auto-save · Google Sheets integration*
