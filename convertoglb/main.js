var fs = require("fs");

function ConvertToGLB(gltf, outputFilename, sourceFilename) {
  const Binary = {
    Magic: 0x46546c67,
  };

  const bufferMap = new Map();

  function decodeBase64(uri) {
    return Buffer.from(uri.split(",")[1], "base64");
  }

  function alignedLength(value) {
    const alignValue = 4;
    if (value == 0) {
      return value;
    }

    const multiple = value % alignValue;
    if (multiple === 0) {
      return value;
    }

    return value + (alignValue - multiple);
  }

  function dataFromUri(buffer, basePath) {
    if (buffer.uri == null) {
      return null;
    }
    if (isBase64(buffer.uri)) {
      const mimeTypePos = buffer.uri.indexOf(";");
      if (mimeTypePos > 0) {
        const mimeType = buffer.uri.substring(5, mimeTypePos);
        return {
          mimeType: mimeType,
          buffer: decodeBase64(buffer.uri),
        };
      } else {
        return null;
      }
    } else {
      const fullUri = decodeURI(Url.resolve(basePath, buffer.uri));
      const mimeType = guessMimeType(fullUri);
      return {
        mimeType: mimeType,
        buffer: fs.readFileSync(fullUri),
      };
    }
  }

  let bufferOffset = 0;
  const outputBuffers = [];
  let bufferIndex = 0;
  // Get current buffers already defined in bufferViews
  for (; bufferIndex < gltf.buffers.length; bufferIndex++) {
    const buffer = gltf.buffers[bufferIndex];
    const data = dataFromUri(buffer, sourceFilename);
    if (data == null) {
      continue;
    }
    outputBuffers.push(data.buffer);
    delete buffer["uri"];
    buffer["byteLength"] = data.buffer.length;
    bufferMap.set(bufferIndex, bufferOffset);
    bufferOffset += alignedLength(data.buffer.length);
  }
  for (const bufferView of gltf.bufferViews) {
    bufferView.byteOffset =
      (bufferView.byteOffset || 0) + bufferMap.get(bufferView.buffer);
    bufferView.buffer = 0;
  }

  const convertToBufferView = (buffer, data) => {
    const bufferView = {
      buffer: 0,
      byteOffset: bufferOffset,
      byteLength: data.buffer.length,
    };

    bufferMap.set(bufferIndex, bufferOffset);
    bufferIndex++;
    bufferOffset += alignedLength(data.buffer.length);

    const bufferViewIndex = gltf.bufferViews.length;
    gltf.bufferViews.push(bufferView);
    outputBuffers.push(data.buffer);

    buffer["bufferView"] = bufferViewIndex;
    buffer["mimeType"] = data.mimeType;
    delete buffer["uri"];
  };

  if (gltf.images) {
    for (const image of gltf.images) {
      const data = dataFromUri(image, sourceFilename);
      if (data == null) {
        delete image["uri"];
        continue;
      }

      convertToBufferView(image, data);
    }
  }

  if (gltf.shaders) {
    for (const shader of gltf.shaders) {
      const data = dataFromUri(shader, sourceFilename);
      if (data == null) {
        delete shader["uri"];
        continue;
      }

      convertToBufferView(shader, data);
    }
  }

  if (gltf.extensions) {
    for (const extensionName in gltf.extensions) {
      const extension = gltf.extensions[extensionName];
      for (const extensionPropertyName in extension) {
        const extensionProperty = extension[extensionPropertyName];
        if (extensionProperty instanceof Array) {
          for (const buffer of extensionProperty) {
            const data = dataFromUri(buffer, sourceFilename);
            if (data == null) {
              continue;
            }

            convertToBufferView(buffer, data);
          }
        }
      }
    }
  }

  const binBufferSize = bufferOffset;

  gltf.buffers = [
    {
      byteLength: binBufferSize,
    },
  ];

  let jsonBuffer2 = Buffer.from(JSON.stringify(gltf), "utf8");
  let jsonBuffer = serialize(gltf);
  jsonBuffer[0] = 32;
  const jsonAlignedLength = alignedLength(jsonBuffer.length);
  if (jsonAlignedLength !== jsonBuffer.length) {
    const tmpJsonBuffer = Buffer.alloc(jsonAlignedLength, " ", "utf8");
    jsonBuffer.copy(tmpJsonBuffer, 1);
    jsonBuffer = tmpJsonBuffer;
  }

  const totalSize =
    12 + // file header: magic + version + length
    8 + // json chunk header: json length + type
    jsonAlignedLength +
    8 + // bin chunk header: chunk length + type
    binBufferSize;

  const finalBuffer = Buffer.alloc(totalSize);
  const dataView = new DataView(finalBuffer.buffer);
  let bufIndex = 0;
  dataView.setUint32(bufIndex, Binary.Magic, true);
  bufIndex += 4;
  dataView.setUint32(bufIndex, 2, true);
  bufIndex += 4;
  dataView.setUint32(bufIndex, totalSize, true);
  bufIndex += 4;

  // JSON
  dataView.setUint32(bufIndex, jsonBuffer.length, true);
  bufIndex += 4;
  dataView.setUint32(bufIndex, 0x4e4f534a, true);
  bufIndex += 4;
  jsonBuffer.copy(finalBuffer, bufIndex);
  bufIndex += jsonAlignedLength;

  // BIN
  dataView.setUint32(bufIndex, binBufferSize, true);
  bufIndex += 4;
  dataView.setUint32(bufIndex, 0x004e4942, true);
  bufIndex += 4;

  for (let i = 0; i < outputBuffers.length; i++) {
    const bufferIndexOffset = bufferMap.get(i);
    if (bufferIndexOffset == undefined) {
      continue;
    }
    outputBuffers[i].copy(finalBuffer, bufIndex + bufferIndexOffset);
  }

  fs.writeFileSync(outputFilename, finalBuffer, "binary");
}

gltf = {
  scenes: [
    {
      nodes: [0],
    },
  ],

  nodes: [
    {
      mesh: 0,
    },
  ],

  meshes: [
    {
      primitives: [
        {
          attributes: {
            POSITION: 1,
          },
          indices: 0,
        },
      ],
    },
  ],

  buffers: [
    {
      uri: "data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=",
      byteLength: 44,
    },
  ],
  bufferViews: [
    {
      buffer: 0,
      byteOffset: 0,
      byteLength: 6,
      target: 34963,
    },
    {
      buffer: 0,
      byteOffset: 8,
      byteLength: 36,
      target: 34962,
    },
  ],
  accessors: [
    {
      bufferView: 0,
      byteOffset: 0,
      componentType: 5123,
      count: 3,
      type: "SCALAR",
      max: [2],
      min: [0],
    },
    {
      bufferView: 1,
      byteOffset: 0,
      componentType: 5126,
      count: 3,
      type: "VEC3",
      max: [1.0, 1.0, 0.0],
      min: [0.0, 0.0, 0.0],
    },
  ],

  asset: {
    version: "2.0",
  },
};

function isBase64(uri) {
  return uri.length < 5 ? false : uri.substr(0, 5) === "data:";
}

function main() {
  // in_ = gltf; //fs.readFileSync("box.gltf")
  in_ = fs.readFileSync("models/image_01.gltf");
  out_ = "box-result.glb";
  ConvertToGLB(in_, out_);
}

main();
