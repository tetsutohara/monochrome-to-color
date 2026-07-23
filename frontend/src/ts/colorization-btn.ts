(() => {
  const colorizationBtn = document.querySelector(
    "#colorization-btn",
  ) as SVGAElement;
  const serverURL = "http://127.0.0.1:3000";

  colorizationBtn.addEventListener("click", async (e) => {
    const inputMonochromeImgArr = document.querySelector(
      "#monochrome-img",
    ) as HTMLInputElement;
    e.preventDefault();

    const files: FileList | null = inputMonochromeImgArr.files;
    const file = files?.[0];
    if (!file) {
      alert("Please attach monochrome image");
      return;
    }

    const form = new FormData();
    form.append("file", file, file.name);

    try {
      const res = await fetch(serverURL, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status} ${errText}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const colorizedPreview = document.querySelector<HTMLImageElement>(
        "#colorization-preview",
      );
      if (colorizedPreview === null) {
        return;
      }
      colorizedPreview.src = url;
    } catch (err) {
      console.error(err);
    }
  });
})();
