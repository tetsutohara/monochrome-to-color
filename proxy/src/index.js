import express from "express";
import cors from "cors";
import multer from "multer";
import * as dotenv from "dotenv";
dotenv.config();
const FRONT_END_URL = process.env?.FRONT_END_URL;
if ((FRONT_END_URL === null) || (FRONT_END_URL === undefined)) {
    console.error("Undefined frontend URL");
    process.exit(1);
}
const app = express();
const upload = multer();
app.use(cors({
    origin: [FRONT_END_URL],
    methods: ["POST"]
}));
app.post("/", upload.single("file"), async (req, res) => {
    const file = req?.file;
    if (!file) {
        return res.status(400).json({ ok: false, error: "No file" });
    }
    const FAST_API_URL = process.env?.FAST_API_URL + "api/colorize";
    if (!FAST_API_URL) {
        return res.status(400).json({ ok: false, error: "No API URL" });
    }
    const form = new FormData();
    const blob = new Blob([file.buffer]);
    form.append("file", blob, file.originalname);
    try {
        const apiRes = await fetch(FAST_API_URL, {
            method: "POST",
            body: form,
        });
        const arrayBuffer = await apiRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = apiRes.headers.get("content-type") || "application/octet-stream";
        res
            .status(apiRes.status)
            .setHeader("Content-Type", contentType)
            .send(buffer);
    }
    catch (e) {
        console.error(e);
    }
});
app.listen(3000, () => {
    console.log("Proxy server is running on 3000 port");
});
//# sourceMappingURL=index.js.map