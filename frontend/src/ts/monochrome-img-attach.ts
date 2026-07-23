(() => {
  const input = document.getElementById('monochrome-img') as HTMLInputElement || null;
  if (!input) {
    return;
  }
  input.addEventListener('change', () => {
    const img = input.files?.[0];
    if (!img) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
    const preview = document.getElementById('preview') as HTMLImageElement;
      if (!preview) {
        return;
      }
      preview.src = reader.result as string;
    }
    
    reader.readAsDataURL(img);
  })
})()