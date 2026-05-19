const sharp = require('sharp');

async function cropWhite() {
  try {
    const original = 'C:/Users/Nikhil Sharma/.gemini/antigravity/brain/1d8554f8-2954-4661-a13f-26a7f343131f/media__1779159887862.png';
    const outputPath = './public/logo.png';
    
    console.log("Processing image...");
    
    // We will extract the raw pixel data
    const { data, info } = await sharp(original)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
      
    const { width, height, channels } = info;
    
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx+1];
        const b = data[idx+2];
        const a = data[idx+3];
        
        // If it's not transparent AND it's not white
        // White is high r,g,b. Let's say anything < 240 is non-white
        if (a > 10 && (r < 250 || g < 250 || b < 250)) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    console.log(`Bounding box: minX=${minX}, minY=${minY}, maxX=${maxX}, maxY=${maxY}`);
    
    if (minX <= maxX && minY <= maxY) {
      await sharp(original)
        .extract({
          left: minX,
          top: minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1
        })
        .toFile(outputPath);
      console.log("Successfully cropped non-white pixels.");
    } else {
      console.log("Could not find bounds.");
    }
  } catch(e) {
    console.error(e);
  }
}

cropWhite();
