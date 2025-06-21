const { createApp } = Vue;

const app = createApp({
    setup() {
        return {};
    },
});

// Register components
app.component("chart-container", window.Highchart);
app.component("side-bar", window.Sidebar);

// Use router
app.use(router);
app.mount("#app");
