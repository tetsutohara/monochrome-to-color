const input = document.getElementById('monochrome-img') as HTMLInputElement;
const preview = document.getElementById('preview') as HTMLImageElement;

input?.addEventListener('change', (e) => {
  const file: File | undefined = input.files?.[0];
  if (!file) {
    console.error('No input file');
    return;
  }
  
  preview.src = URL.createObjectURL(file);
})