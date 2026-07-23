import express from "express";
import type { Express } from "express";
import cors from "cors";
import multer from "multer";

const FAST_API_URL = "http://172.17.0.1:8080/api/colorize";
const host = "0.0.0.0";
const port = 3000;

const app: Express = express();
const upload = multer();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["POST"],
  }),
);

// For debug
app.get("/hello-world", (req, res) => {
  console.log("Debug GET call");
  res.send("Hello World!");
});

app.post(
  "/",
  upload.single("file"),
  async (req: express.Request, res: express.Response) => {
    const file: any = req?.file;
    if (!file) {
      return res.status(400).json({ ok: false, error: "No file" });
    }

    if (!FAST_API_URL) {
      return res.status(400).json({ ok: false, error: "No API URL" });
    }

    const form = new FormData();
    const blob = new Blob([file.buffer]);
    form.append("file", blob, file.originalname);
    try {
      console.log("FAST API CALL");
      const apiRes = await fetch(FAST_API_URL, {
        method: "POST",
        body: form,
      });

      const arrayBuffer = await apiRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType =
        apiRes.headers.get("content-type") || "application/octet-stream";

      res
        .status(apiRes.status)
        .setHeader("Content-Type", contentType)
        .send(buffer);
    } catch (e) {
      console.error(e);
    }
  },
);

app.listen(port, host, () => {
  console.log("Proxy server is running on 3000 port");
});
