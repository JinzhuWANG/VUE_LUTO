const { createApp } = Vue;

// Initialize app
const app = createApp({
    setup() {
        return {};
    },
});

// Register other components
app.component("chart-container", window.Highchart);
app.component("side-bar", window.Sidebar);
app.component('map-geojson', window.map_geojson);
app.component('ranking-cards', window.RankingCards);

// Use modules
app.use(ElementPlus);
app.use(window.router);

app.mount("#app");
