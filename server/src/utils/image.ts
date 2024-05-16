import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

export const IMAGES_URL_PATH = "/uploads";
export const IMAGES_PATH = path.join(__dirname, "../..", IMAGES_URL_PATH);

const exts: Partial<Record<string, string>> = {
  "image/png": "png",
  "image/webp": "webp",
  "image/jpeg": "jpeg",
};

/** Try to get the content type by the image magic header */
const getContentType = (buf: Buffer) => {
  const u1 = buf.readUint32BE(0);
  const u2 = buf.readUint32BE(4);
  const u3 = buf.readUint32BE(8);
  if (u1 === 0x89504e47 && u2 === 0x0d0a1a0a) {
    return "image/png";
  } else if (u1 === 0xffd8ffe0 || u1 === 0xffd8ffe1 || u1 === 0xffd8ffee) {
    return "image/jpeg";
  } else if (u1 === 0x52494646 && u2 === buf.length && u3 === 0x57454250) {
    return "image/webp";
  }
};

/**
 * Get the image data from `image`. If it's base64 encoded image data, decode it. If it's a URL,
 * download the image.
 */
const getImageData = async (image: string) => {
  if (image.startsWith("base64:")) {
    const data = Buffer.from(image.slice(7), "base64");
    const typ = getContentType(data);
    if (!typ) {
      throw new Error("Unsupported base64 encoded image type (must be png, webp, or jpg)");
    }
    return { data, ext: exts[typ] };
  }

  const resp = await fetch(image);
  const ct = resp.headers.get("Content-Type");
  const ext = exts[ct?.split(";")?.[0] || ""];
  if (!ext) {
    throw new Error(
      `'${image}' returned unsupported content type ${ct} (must be png, webp, or jpg)`
    );
  }
  return { data: new DataView(await resp.blob().then((buf) => buf.arrayBuffer())), ext };
};

/**
 * Download/decode `image` and save it to the public images folder
 * @returns The public URL to the image on our server
 */
export const processImage = async (image: string) => {
  const res = await getImageData(image);
  const file = `${randomUUID()}.${res.ext}`;
  await writeFile(`${IMAGES_PATH}/${file}`, res.data);
  return `${IMAGES_URL_PATH}/${file}`;
};
