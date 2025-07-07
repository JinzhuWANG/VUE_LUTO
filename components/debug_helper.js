// Helper function to check if Leaflet is properly loaded
window.checkLeafletStatus = function () {
    console.log("Checking Leaflet status...");

    // Check if Leaflet is loaded
    if (window.L) {
        console.log("Leaflet is loaded:", window.L);
        return true;
    } else {
        console.error("Leaflet is not loaded");
        return false;
    }
};

// Helper function to check DOM element dimensions
window.checkElementDimensions = function (elementQuery) {
    const element = document.querySelector(elementQuery);

    if (element) {
        const rect = element.getBoundingClientRect();
        console.log(`Element ${elementQuery} dimensions:`, {
            width: rect.width,
            height: rect.height,
            offsetWidth: element.offsetWidth,
            offsetHeight: element.offsetHeight,
            clientWidth: element.clientWidth,
            clientHeight: element.clientHeight
        });
        return true;
    } else {
        console.error(`Element ${elementQuery} not found`);
        return false;
    }
};

// Helper function to inspect Vue component
window.inspectVueComponent = function (componentName) {
    setTimeout(() => {
        const elements = document.querySelectorAll(componentName);
        console.log(`Found ${elements.length} ${componentName} elements:`, elements);

        elements.forEach((el, i) => {
            console.log(`${componentName} #${i} dimensions:`, {
                width: el.offsetWidth,
                height: el.offsetHeight,
                visible: el.offsetParent !== null
            });
        });
    }, 1000);
};
