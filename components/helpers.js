window.loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);

        if (existingScript) {
            resolve(); // Script already exists
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);

    });
};

window.loadDataset = async (datasetName, timeout = 5000) => {
    try {
        // Load the required scripts simultaneously
        await Promise.all([
            loadScript(`./data/${datasetName}.js`),
            loadScript("./data/chart_option/Chart_default_options.js"),
        ]);

        // Wait until the dataset is available in the window object or timeout occurs
        const start = Date.now();
        while (!window[datasetName]) {
            if (Date.now() - start > timeout) {
                throw new Error(`Timeout waiting for dataset ${datasetName}`);
            }
            // Pause briefly to allow the dataset to load
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        return window[datasetName];
    } catch (error) {
        console.error(`Error loading dataset ${datasetName}:`, error);
    }
};
