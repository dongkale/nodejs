const express = require("express");
// const cors = require("cors"); // cors 설정을 편안하게 하는 패키지
const path = require("path");

const app = express();
const port = 3050;

// 네트워크 드라이브 경로 설정 (예: Z 드라이브)
// http://localhost:3050/gltf_models/image-01/image_01.gltf
// const networkDrivePath = "X:/Temp/이동관/gltf_files";

// http://localhost:3050/gltf_models/image-01/image_01.gltf
const networkDrivePath = "files";

// app.use(
//   cors({
//     origin: "http://localhost:3002", // 접근 권한을 부여하는 도메인
//     credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
//     optionsSuccessStatus: 200, // 응답 상태 200으로 설정
//   })
// );

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// 네트워크 드라이브 경로를 서빙
https: app.use("/gltf_models", express.static(networkDrivePath));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// file upload, download
// https://javascript.plainenglish.io/uploading-files-using-multer-on-server-in-nodejs-and-expressjs-5f4e621ccc67
