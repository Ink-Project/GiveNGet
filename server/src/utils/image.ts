import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

export const IMAGES_URL_PATH = "/uploads";
export const IMAGES_PATH = path.join(__dirname, "../..", IMAGES_URL_PATH);

const exts: Partial<Record<string, string>> = {
  "image/png": "png",
  "image/webp": "webp",
  "image/jpeg": "jpeg",
  "image/bmp": "bmp",
};

/** Get the image data from `image`. */
const getImageData = async (image: string) => {
  const resp = await fetch(image);
  const ct = resp.headers.get("Content-Type");
  const ext = exts[ct?.split(";")?.[0] || ""];
  if (!ext) {
    throw new Error(
      `'${image}' returned unsupported content type ${ct} (must be png, webp, or jpg)`
    );
  }
  return { data: new Uint8Array(await resp.arrayBuffer()), ext };
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
