import { config } from "dotenv";
import FtpDeploy from "ftp-deploy";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// เริ่มต้น dotenv
config();

const ftpDeploy = new FtpDeploy();

// สำหรับ ES modules ต้องใช้วิธีนี้แทน __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FTP Configuration
const ftpConfig = {
  user: process.env.FTP_USER || "your-ftp-username",
  password: process.env.FTP_PASSWORD || "your-ftp-password",
  host: process.env.FTP_HOST || "your-ftp-host.com",
  port: process.env.FTP_PORT || 22,
  localRoot: join(__dirname, "dist"),
  remoteRoot: process.env.FTP_REMOTE_ROOT || "/var/www/html/",
  include: ["*", "**/*"],
  exclude: [
    "dist/**/*.map",
    "node_modules/**",
    "node_modules/**/.*",
    ".git/**",
  ],
  deleteRemote: true, // ลบไฟล์เก่าก่อน deploy ใหม่
  forcePasv: true,
  sftp: true, // ใช้ SFTP เพราะ port 22
};

console.log("🚀 Starting deployment to FTP server...");
console.log(`📁 Local: ${ftpConfig.localRoot}`);
console.log(`🌐 Remote: ${ftpConfig.host}${ftpConfig.remoteRoot}`);

ftpDeploy
  .deploy(ftpConfig)
  .then((res) => {
    console.log("✅ Deployment completed successfully!");
    console.log(`📊 Uploaded ${res.length} files`);
  })
  .catch((err) => {
    console.error("❌ Deployment failed:");
    console.error(err);
    process.exit(1);
  });

// แสดง progress
ftpDeploy.on("uploading", function (data) {
  console.log(
    `📤 Uploading: ${data.filename} (${data.transferredFileCount}/${data.totalFilesCount})`
  );
});

ftpDeploy.on("uploaded", function (data) {
  console.log(`✓ Uploaded: ${data.filename}`);
});

ftpDeploy.on("log", function (data) {
  console.log(data);
});
