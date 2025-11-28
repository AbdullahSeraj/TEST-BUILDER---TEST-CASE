import { useEffect, useState } from "react";

export const useLoading = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleImagesLoaded = () => {
            const images = document.images;
            let loadedCount = 0;
            const totalImages = images.length;

            if (totalImages === 0) {
                finishLoading();
                return;
            }

            function checkDone() {
                loadedCount++;
                if (loadedCount === totalImages) finishLoading();
            }

            for (let i = 0; i < totalImages; i++) {
                const img = images[i];
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.addEventListener("load", checkDone);
                    img.addEventListener("error", checkDone);
                }
            }

            if (loadedCount === totalImages) finishLoading();
        };

        function finishLoading() {
            setTimeout(() => setLoading(false), 2000);
        }

        handleImagesLoaded();
    }, []);

    return loading;
};
