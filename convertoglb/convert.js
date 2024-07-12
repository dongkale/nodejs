// const fs = require("fs");
// const path = require("path");
// const { processGltf } = require("gltf-pipeline");

// async function convertGltfToGlb(inputPath, outputPath) {
//   try {
//     // Read the GLTF file
//     const gltf = JSON.parse(fs.readFileSync(inputPath));

//     // Convert to GLB
//     const options = { binary: true };
//     const results = await processGltf(gltf, options);

//     // Write the GLB file
//     fs.writeFileSync(outputPath, results.glb);

//     console.log("Conversion successful:", outputPath);
//   } catch (error) {
//     console.error("Error converting GLTF to GLB:", error);
//   }
// }

// // Replace these paths with the paths to your input GLTF and desired output GLB
// const inputPath = path.resolve(__dirname, "./image_01.gltf");
// const outputPath = path.resolve(__dirname, "model.glb");

// convertGltfToGlb(inputPath, outputPath);

/// ---

// const fs = require("fs");
// const path = require("path");
// const { processGltf } = require("gltf-pipeline");

// async function convertGltfToGlb(inputPath, outputPath) {
//   try {
//     // Read the GLTF file
//     const gltf = JSON.parse(fs.readFileSync(inputPath));

//     // Get the directory containing the GLTF file and its resources
//     const resourceDirectory = path.dirname(inputPath);

//     // Convert to GLB with resource directory specified
//     const options = {
//       binary: true,
//       resourceDirectory: resourceDirectory, // Specify the resource directory
//     };
//     const results = await processGltf(gltf, options);

//     // Write the GLB file
//     fs.writeFileSync(outputPath, results.glb);

//     console.log("Conversion successful:", outputPath);
//   } catch (error) {
//     console.error("Error converting GLTF to GLB:", error);
//   }
// }

// // Replace these paths with the paths to your input GLTF and desired output GLB
// const inputPath = path.resolve(__dirname, "models/image_01.gltf"); // Example path
// const outputPath = path.resolve(__dirname, "model.glb");

// convertGltfToGlb(inputPath, outputPath);

// -------

// const gltfPipeline = require("gltf-pipeline");
// const fsExtra = require("fs-extra");

// const gltfToGlb = gltfPipeline.gltfToGlb;
// const gltf = fsExtra.readJsonSync("models/image_01.gltf");
// console.log(gltf);

// gltfToGlb(gltf).then(function (results) {
//   console.log(results);
//   // fsExtra.writeFileSync("model.glb", results.glb);
// });

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

/*
const gltfPipeline = require("gltf-pipeline");
const fsExtra = require("fs-extra");
const path = require("path");

const resourceDirectory = "./models/";
const resourceGltfFile = "image_01.gltf";

const outputDirectory = "./output/";
const outputGlbFile = "image_01.glb";

// const gltfToGlb = gltfPipeline.gltfToGlb;
// const gltf = fsExtra.readJsonSync("./models/image_01.gltf");
// const options = { resourceDirectory: "./models/" };

// console.log(gltf);

// gltfToGlb(gltf, options).then(function (results) {
//   fsExtra.writeFileSync("./output/model.glb", results.glb);
// });

const gltfToGlb = gltfPipeline.gltfToGlb;
const gltf = fsExtra.readJsonSync(`${resourceDirectory}${resourceGltfFile}`);
const options = { resourceDirectory: `${resourceDirectory}` };

gltfToGlb(gltf, options).then(function (results) {
  fsExtra.writeFileSync(`${outputDirectory}${outputGlbFile}`, results.glb);
});
*/

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

// Saving separate textures

// const gltfPipeline = require("gltf-pipeline");
// const fsExtra = require("fs-extra");
// const processGltf = gltfPipeline.processGltf;
// const gltf = fsExtra.readJsonSync("./models/image_01.gltf");
// const options = {
//   resourceDirectory: "./models/",
//   separateTextures: true,
// };

// console.log(gltf);

// processGltf(gltf, options).then(function (results) {
//   fsExtra.writeJsonSync("model-separate.gltf", results.gltf);

//   // Save separate resources
//   const separateResources = results.separateResources;
//   for (const relativePath in separateResources) {
//     if (separateResources.hasOwnProperty(relativePath)) {
//       const resource = separateResources[relativePath];
//       fsExtra.writeFileSync(relativePath, resource);
//     }
//   }
// });

// --
// const fileURLToPath = require("url");
// const { fileURLToPath } = require("node:url");
// const path = require("path");

// const ff = new URL(
//   "http://localhost:3050/gltf_models/image-01-glb/image_01.gltf"
// )
//   .openConnection()
//   .getInputStream();

// const __f = fileURLToPath(
//   "http://localhost:3050/gltf_models/image-01-glb/image_01.gltf"
// );
// const __d = path.dirname(__f);
// const gltf__ = fsExtra.readJsonSync(__d);

// let __f = reader.readAsDataURL(
//   "http://localhost:3050/gltf_models/image-01-glb/image_01.glb"
// );

// await fetch("http://localhost:3050/gltf_models/image-01-glb/image_01.glb");
// const body = await response.blob();
// .then((r) => r.text())
// .then((t) => console.log(t));

// console.log(__f);
// --

// async function __ff__() {
//   const response = await fetch(
//     "http://localhost:3050/gltf_models/image-01-glb/image_01.glb"
//   );
//   // const body = await response.blob();
//   const data = await response.json();
//   if (response.ok) {
//     return data;
//   } else {
//     throw Error(data);
//   }

//   // console.log(body);
// }

// async function* makeTextFileLineIterator(fileURL) {
//   const utf8Decoder = new TextDecoder("utf-8");
//   const response = await fetch(fileURL);
//   const reader = response.body.getReader();
//   let { value: chunk, done: readerDone } = await reader.read();
//   chunk = chunk ? utf8Decoder.decode(chunk) : "";

//   const re = /\n|\r|\r\n/gm;
//   let startIndex = 0;
//   let result;

//   for (;;) {
//     let result = re.exec(chunk);
//     if (!result) {
//       if (readerDone) {
//         break;
//       }
//       let remainder = chunk.substr(startIndex);
//       ({ value: chunk, done: readerDone } = await reader.read());
//       chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : "");
//       startIndex = re.lastIndex = 0;
//       continue;
//     }
//     yield chunk.substring(startIndex, result.index);
//     startIndex = re.lastIndex;
//   }
//   if (startIndex < chunk.length) {
//     // 마지막 줄이 개행 문자로 끝나지 않았을 때
//     yield chunk.substr(startIndex);
//   }
// }

// async function run() {
//   for await (let line of makeTextFileLineIterator(
//     "http://localhost:3050/gltf_models/image-01-glb/image_01.glb"
//   )) {
//     console.log(line);
//   }
// }

// run();

// --------------------------------------------------------------------

// -- fileDownloadfromURL

// const { createWriteStream } = require("fs");
// const { Readable } = require("stream");

// async function fileDownloadfromURL(url, toFilename = null) {
//   const fileName = toFilename != null ? toFilename : url.split("/").pop();

//   const response = await fetch(url);
//   if (response.ok && response.body) {
//     console.log("Writing to file:", fileName);
//     let writer = createWriteStream(fileName);
//     Readable.fromWeb(response.body).pipe(writer);
//   }
// }

// fileDownloadfromURL(
//   "http://localhost:3050/gltf_models/image-01-glb/image_01.glb",
//   "__m.glb"
// );

// -- fileDownloadfromURL 2

const http = require("http");
const fs = require("fs");

// const fileUrl = "http://example.com/file.txt";
// const destination = "downloaded_file.txt";

async function fileDownloadfromURL_Ex(fileUrl, destination = null) {
  const file = fs.createWriteStream(destination);

  http
    .get(fileUrl, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          console.log("File downloaded successfully: " + destination);
        });
      });
    })
    .on("error", (err) => {
      fs.unlink(destination, () => {
        console.error("Error downloading file:", err);
      });
    });

  return destination;
}

// -- fileDownloadfromURL 3

const download = require("download");

// // Url of the image
// const file = "GFG.jpeg";
// // Path at which image will get downloaded
// const filePath = `${__dirname}/files`;

async function fileDownloadfromURL_Ex_Ex(fileUrl, destination = null) {
  const directory = path.dirname(destination);
  const destFileName = path.basename(destination);

  download(fileUrl, directory, {
    filename: destFileName,
  }).then(() => {
    console.log("Download Completed:" + destination);
  });

  return destination;
}

async function fileDownloadsfromURL(fileUrls, destinationforder) {
  const downloads = [];

  for (const fileUrl of fileUrls) {
    const destFileName = path.basename(fileUrl);

    const downloadResult = await download(fileUrl, destinationforder, {
      filename: destFileName,
    })
      .then(() => {
        console.log(`downloading file: ${fileUrl}`);
        return fileUrl;
      })
      .catch((err) => {
        console.error(
          `Error downloading file: ${fileUrl} -> ${err.statusMessage}(${err.statusCode})`
        );
        return `${fileUrl} -> error: ${err.statusMessage}(${err.statusCode})`;
      });

    downloads.push(downloadResult);
  }

  return downloads;
}

async function fileDownloadsfromURLZip(fileUrls, destinationforder) {
  const downloads = [];

  for (const fileUrl of fileUrls) {
    const destFileName = path.basename(fileUrl);

    const downloadResult = await download(fileUrl, destinationforder, {
      extract: true,
      filename: destFileName,
    })
      .then(() => {
        console.log(`downloading file(zip): ${fileUrl}`);
        return fileUrl;
      })
      .catch((err) => {
        console.error(
          `Error downloading file(zip): ${fileUrl} -> ${err.statusMessage}(${err.statusCode})`
        );
        return `${fileUrl} -> error: ${err.statusMessage}(${err.statusCode})`;
      });

    downloads.push(downloadResult);
  }

  return downloads;
}

// -- gltf

const gltfPipeline = require("gltf-pipeline");
const fsExtra = require("fs-extra");
const path = require("path");

function convertGltfToGlb(resourceInput, output) {
  const resourceDirectory = path.dirname(resourceInput);
  const resourceGltfFile = path.basename(resourceInput);

  // console.log(resourceDirectory);
  // console.log(resourceGltfFile);

  const gltfToGlb = gltfPipeline.gltfToGlb;
  const gltf = fsExtra.readJsonSync(`${resourceDirectory}/${resourceGltfFile}`);
  const options = { resourceDirectory: `${resourceDirectory}` };

  gltfToGlb(gltf, options).then(function (results) {
    fsExtra.writeFileSync(output, results.glb);
  });

  return output;
}

// -- zip

const archiver = require("archiver");
// const fs = require("fs");

/*
// download() 사용 버젼(서버단)
function zipForderToZip__(srcForder, outputPath) {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  // Listen for all archive data to be written.
  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
    res.download(outputPath); // Send the zip file to the client
  });

  // Good practice to catch this error explicitly.
  archive.on("error", function (err) {
    throw err;
  });

  // Pipe archive data to the file.
  archive.pipe(output);

  // Append files from a directory, putting its contents at the root of archive.
  archive.directory(srcForder, false);

  // Finalize the archive (i.e. we are done appending files but streams have to finish yet).
  archive.finalize();

  return outputPath;
}
  */

async function archiveDirToZip(srcDir, zipPath, callbackFinish) {
  const begin = new Date().getTime();

  let output = fs.createWriteStream(zipPath);
  let archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );

    const end = new Date().getTime(); // 측정 종료

    callbackFinish(zipPath, end - begin);
  });

  // archive.on("warning", function (err) {
  //   if (err.code === "ENOENT") {
  //     console.log(err);
  //   } else {
  //     console.log(err);
  //     throw err;
  //   }
  // });

  // archive.on("error", function (err) {
  //   console.log(err);
  //   throw err;
  // });

  // archive.pipe(output);
  // archive.directory(srcDir, "");

  // on(event: "data", listener: (data: Buffer) => void): this;
  //       on(event: "progress", listener: (progress: ProgressData) => void): this;
  //       on(event: "close" | "drain" | "finish", listener: () => void): this;

  archive
    .directory(srcDir, false)
    .on("error", (err) => {
      console.log(err);
      throw err;
    })
    .on("warning", function (err) {
      if (err.code === "ENOENT") {
        console.log(err);
      } else {
        console.log(err);
        throw err;
      }
    })
    // .on("progress", function (progress) {
    //   console.log(progress);
    // })
    .on("close", function () {
      console.log("close");
    })
    .on("finish", function () {
      console.log("finish");
    })
    .pipe(output);

  // archive.finalize();
  await archive.finalize().then(function () {
    console.log("done");
  });

  return zipPath;
}

async function main() {
  // const resourceDirectory = "__m/models/image-01";
  // const resourceGltfFile = "image_01.gltf";

  // const outputDirectory = "output";
  // const outputGlbFile = "image_03.glb";

  // const output = convertGltfToGlb(
  //   `${resourceDirectory}/${resourceGltfFile}`,
  //   `${outputDirectory}/${outputGlbFile}`
  // );

  // console.log("Conversion successful:", output);

  // const fileUrl = "http://localhost:3050/gltf_models/image-01-glb/image_01.glb";
  // const destination = "output/downloaded_file3.glb";

  // const r = await fileDownloadfromURL_Ex(fileUrl, destination);
  // console.log("Download successful:", r);

  // const r2 = fileDownloadfromURL_Ex_Ex(fileUrl, destination);
  // console.log("Download successful:", r2);

  // ---

  // const fileUrls = [];

  // fileUrls.push("http://localhost:3050/gltf_models/image-01/image_01.bin");
  // fileUrls.push("http://localhost:3050/gltf_models/image-01/image_01.gltf");
  // fileUrls.push(
  //   "http://localhost:3050/gltf_models/image-01/WorldGridMaterial_BaseColor.png"
  // );
  // fileUrls.push(
  //   "http://localhost:3050/gltf_models/image-01/WorldGridMaterial_MetallicRoughness.png"
  // );
  // fileUrls.push(
  //   "http://localhost:3050/gltf_models/image-01/WorldGridMaterial_Normal.png"
  // );
  // // fileUrls.push(
  // //   "http://localhost:3050/gltf_models/image-01/WorldGridMaterial_Normal.p"
  // // );

  // const r2 = await fileDownloadsfromURL(fileUrls, "output/models/image-01");

  // console.log(r2);

  // ----

  // const fileUrls2 = [];
  // fileUrls2.push("http://localhost:3050/gltf_models/image-01/image_01.zip");

  // const r3 = await fileDownloadsfromURLZip(
  //   fileUrls,
  //   "output/models/image-01-zip"
  // );

  // console.log(r3);

  // https://forum.freecodecamp.org/t/load-local-text-file-with-js/83063/7
  // https://www.clouddefense.ai/code/javascript/example/archiver
  const r4 = await archiveDirToZip(
    "output/models/image-01",
    "output/models/image-01/temp.zip",
    (zipPath, durationTime) => {
      console.log("zipPath: " + zipPath);
      console.log("durationTime: " + durationTime + " ms");
    }
  );

  console.log(`=== ${r4}`);
}

main();
