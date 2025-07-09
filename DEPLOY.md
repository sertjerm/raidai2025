# RAIDAI 2025 - FTP Deployment Guide

## การตั้งค่า FTP Deployment

### 1. คัดลอกไฟล์ environment variables

```bash
cp .env.example .env
```

### 2. แก้ไขไฟล์ `.env` ด้วยข้อมูล FTP server ของคุณ

```env
FTP_HOST=your-ftp-host.com
FTP_USER=your-ftp-username
FTP_PASSWORD=your-ftp-password
FTP_PORT=21
FTP_REMOTE_ROOT=/public_html/raidai2025/
```

### 3. คำสั่งสำหรับ deployment

#### Build แล้ว deploy ในคำสั่งเดียว (แนะนำ)

```bash
npm run build:deploy
```

#### หรือทำแยกขั้นตอน

```bash
# Build โปรเจค
npm run build

# Deploy ไป FTP server
npm run deploy
```

## หมายเหตุ

- ไฟล์ `.env` จะไม่ถูก commit ไป git (อยู่ใน .gitignore)
- ตรวจสอบให้แน่ใจว่า FTP server รองรับ directory ที่ระบุใน `FTP_REMOTE_ROOT`
- หากใช้ SFTP ให้แก้ไข `sftp: true` ในไฟล์ `deploy.js`

## การแก้ไขปัญหา

### ถ้า deploy ล้มเหลว

1. ตรวจสอบ FTP credentials ใน `.env`
2. ตรวจสอบว่า FTP server เข้าถึงได้
3. ตรวจสอบ permissions ของ directory ปลายทาง

### ถ้าเว็บไซต์แสดงผลไม่ถูกต้อง

1. ตรวจสอบไฟล์ `web.config` (สำหรับ IIS) หรือ `.htaccess` (สำหรับ Apache)
2. ตรวจสอบ base path ใน `vite.config.js`
