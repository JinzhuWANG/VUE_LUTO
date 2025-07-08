
window.loadScript = (src, name) => {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);

        if (existingScript && window[name]) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        document.head.appendChild(script);

        script.onload = async () => {
            const timeout = 5000;
            const startTime = Date.now();
            while (!window[name]) {
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Global variable ${name} not available within timeout`));
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            resolve();
        };

        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    });
};

window.loadDataset = async (datasetName, timeout = 5000) => {
    try {
        // Load the required scripts simultaneously
        await Promise.all([
            loadScript(`./data/${datasetName}.js`, datasetName),
            loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options'),
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
