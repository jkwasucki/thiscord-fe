export default function readFile(file: File): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            const reader = new FileReader();

            reader.addEventListener(
                'load',
                () => {
                    const image = new Image();
                    image.onload = () => {
                        const canvas = document.createElement('canvas');
                        const maxWidth = 100; // Set your desired maximum width here
                        const maxHeight = 100; // Set your desired maximum height here
                        let width = image.width;
                        let height = image.height;

                        if (width > height) {
                            if (width > maxWidth) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width *= maxHeight / height;
                                height = maxHeight;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d')!;
                        ctx.drawImage(image, 0, 0, width, height);

                        const resizedImageUrl = canvas.toDataURL('image/jpeg'); // You can change the format if needed
                        resolve(resizedImageUrl);
                    };

                    image.src = reader.result as string;
                },
                false,
            );

            reader.addEventListener('error', (error) => {
                reject(error);
            });

            reader.readAsDataURL(file);
        } else {
            reject(new Error('File type not supported'));
        }
    });
}