import path from "path";

export const IS_PRODUCTION = !!process.env.IN_DEPLOY || process.env.NODE_ENV === "production";
export const PROJECT_ROOT = path.join(__dirname, "../".repeat(2 + Number(IS_PRODUCTION)));

export const DBG_IMAGES_URL_PATH = "/uploads";
export const DBG_IMAGES_PATH = path.join(PROJECT_ROOT, DBG_IMAGES_URL_PATH);
