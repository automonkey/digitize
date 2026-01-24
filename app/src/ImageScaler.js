export default class ImageScaler {
  constructor(options = {}) {
    this.maxWidth = options.maxWidth || 960;
    this.maxHeight = options.maxHeight || 1280;
    this.quality = options.quality || 0.5;
  }

  async scaleFile(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        try {
          const { width, height } = this._calculateDimensions(img.width, img.height);

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const scaledFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                });
                resolve(scaledFile);
              } else {
                resolve(file);
              }
            },
            file.type,
            this.quality
          );
        } catch (error) {
          resolve(file);
        }
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  _calculateDimensions(originalWidth, originalHeight) {
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > this.maxWidth) {
      height = (height * this.maxWidth) / width;
      width = this.maxWidth;
    }

    if (height > this.maxHeight) {
      width = (width * this.maxHeight) / height;
      height = this.maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }
}