from fastapi import HTTPException
import numpy as np
import torch
from PIL import Image
import io
from colorizers import siggraph17, load_img, preprocess_img, postprocess_tens


# -----------------------
# model load
# -----------------------
colorizer_siggraph17 = siggraph17(pretrained=True).eval()

USE_GPU = torch.cuda.is_available()
if USE_GPU:
    colorizer_siggraph17.cuda()

# -----------------------
# Image colorization
# -----------------------
def colorize_image(file_bytes: bytes) -> Image.Image:
    try:
        img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image")
    
    # PIL.Image -> Numpy array
    img_np = np.array(img)
    
    # Get L channel
    (tens_l_orig, tens_l_rs) = preprocess_img(img_np, HW=(256, 256))
    if USE_GPU: 
        tens_l_rs = tens_l_rs.cuda()
        
    # Infer
    out_img = postprocess_tens(tens_l_orig, colorizer_siggraph17(tens_l_rs).cpu())
    
    return out_img