import path from "path";
import express from "express";
import cookieSession from "cookie-session";
import { userRouter, authRouter, postRouter, resvRouter } from "./routers";
import { DBG_IMAGES_PATH, DBG_IMAGES_URL_PATH, PROJECT_ROOT } from "./utils";
import initCommon from "./init";

initCommon();

const FRONTEND_DIST = path.join(PROJECT_ROOT, "../frontend/dist");
const app = express();

// middleware
app.use(
  cookieSession({
    name: "session",
    secret: process.env.SESSION_SECRET,
    // By default, the cookie's lifetime is "session"
    // which means until we close the browser. We like this for now!
    // But in real life you'd set the cookie to expire,
    // and implement an auto re-auth flow, but that's too much at this point.

    // maxAge: 1000 * 60 * 60 * 24  // 24 hours
  }),
); // adds a session property to each request representing the cookie
app.use((req, _res, next) => {
  const time = new Date().toLocaleString();
  console.log(`${req.method}: ${req.originalUrl} - ${time}`);
  next();
}); // print information about each incoming request
app.use(express.json()); // parse incoming request bodies as JSON
app.use(express.static(FRONTEND_DIST)); // Serve static assets from the dist folder of the frontend

if (process.env.NODE_ENV !== "production") {
  app.use(DBG_IMAGES_URL_PATH, express.static(DBG_IMAGES_PATH));
}

app.use("/api/v1", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/reservations", resvRouter);

// Requests meant for the API will be sent along to the router.
// For all other requests, send back the index.html file in the dist folder.
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
