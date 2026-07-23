import os
from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware

# from starlette.responses import StreamingResponse
from PIL import Image
import io
from core import colorize_image
import numpy as np

app = FastAPI()

origins = [
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------
# API endpoint
# -----------------------
@app.post("/api/colorize")
async def colorize(file: UploadFile = File(...)):
    data = await file.read()
    # Change image consists of 0 to 1, to 0 to 255 which can be changed to PNG byte column
    numpy_image = colorize_image(data) * 255
    numpy_image = numpy_image.astype(np.uint8)

    # PIL Image -> PNG byte column
    buf = io.BytesIO()
    pil_img = Image.fromarray(numpy_image)
    pil_img.save(buf, format="PNG")

    return Response(content=buf.getvalue(), media_type="image/png")
    # return StreamingResponse(io.BytesIO(pil_img.tobytes()), media_type="image/png")
