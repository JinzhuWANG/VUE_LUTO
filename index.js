const { createApp } = Vue;

// Initialize app
const app = createApp({
    setup() {
        const { ref, provide } = Vue;
        const sidebarToggleCount = ref(0);

        const handleSidebarToggle = () => {
            sidebarToggleCount.value++;
        };

        provide('sidebarToggleCount', sidebarToggleCount);

        return {
            handleSidebarToggle,
        };
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
