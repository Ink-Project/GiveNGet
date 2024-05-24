import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { DBG_IMAGES_PATH, DBG_IMAGES_URL_PATH } from ".";

const exts: Partial<Record<string, string>> = {
  "image/png": "png",
  "image/webp": "webp",
  "image/jpeg": "jpeg",
  "image/bmp": "bmp",
};

const processImageLocal = async (image: string) => {
  try {
    await mkdir(DBG_IMAGES_PATH, 0o744);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code !== "EEXIST") {
      throw err;
    }
  }

  const resp = await fetch(image);
  const ct = resp.headers.get("Content-Type");
  const ext = exts[ct?.split(";")?.[0] || ""];
  if (!ext) {
    throw new Error(
      `'${image}' returned unsupported content type ${ct} (must be png, webp, jpg, or bmp)`,
    );
  }
  const data = new Uint8Array(await resp.arrayBuffer());
  const file = `${randomUUID()}.${ext}`;
  await writeFile(`${DBG_IMAGES_PATH}/${file}`, data);
  return `${DBG_IMAGES_URL_PATH}/${file}`;
};

const processImageProd = (image: string) => {
  return cloudinary.uploader
    .upload(image, {
      allowed_formats: ["png", "webp", "jpg", "bmp"],
      unique_filename: true,
    })
    .then((resp) => resp.secure_url);
};

/**
 * Download/decode `image` and save it to the public images folder
 * @returns The public URL to the image on our server
 */
export const processImage =
  process.env.NODE_ENV === "production" ? processImageProd : processImageLocal;
