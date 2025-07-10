# วิธีการเพิ่มโลโก้ KUSCC

## ขั้นตอนการเพิ่มโลโก้:

1. **วางไฟล์โลโก้**: ให้วางไฟล์ `kuscc-logo.png` ไว้ใน folder:

   ```
   src/assets/images/kuscc-logo.png
   ```

2. **แก้ไขไฟล์ Login.jsx**:

   - เปิดไฟล์: `src/pages/Login/Login.jsx`
   - ค้นหาบรรทัด: `// import kusccLogo from "@assets/images/kuscc-logo.png";`
   - ลบ `//` เพื่อ uncomment: `import kusccLogo from "@assets/images/kuscc-logo.png";`
   - ค้นหาส่วน comment `{/* <img` และลบ comment ออก เพื่อใช้โลโก้แทน fallback icon

3. **แก้ไขไฟล์ AppHeader.jsx**:
   - เปิดไฟล์: `src/components/Layout/AppHeader.jsx`
   - ทำแบบเดียวกับข้อ 2

## ข้อแนะนำสำหรับไฟล์โลโก้:

- ขนาดที่แนะนำ: 256x256px หรือ 512x512px
- รูปแบบ: PNG (รองรับพื้นหลังโปร่งใส)
- ไฟล์ไม่ควรใหญ่เกิน 500KB เพื่อการโหลดที่เร็ว

## ตัวอย่างการใช้งาน:

หลังจากวางไฟล์โลโก้แล้ว:

- หน้า Login จะแสดงโลโก้ KUSCC ขนาด 80x80px
- Header ของแอปจะแสดงโลโก้ KUSCC ขนาด 32x32px ข้างชื่อระบบ

## หมายเหตุ:

ปัจจุบันใช้ emoji 🏛️ เป็น fallback icon ชั่วคราว จนกว่าจะมีโลโก้จริง
