const { createApp } = Vue;

// Initialize app
const app = createApp({
    setup() {
        const { ref, provide } = Vue;
        const isCollapsed = ref(false);
        const globalSelectedRegion = ref('AUSTRALIA');

        const updateSidebarCollapsed = (value) => {
            isCollapsed.value = value;
        };

        provide('isCollapsed', isCollapsed);
        provide('globalSelectedRegion', globalSelectedRegion);

        return {
            updateSidebarCollapsed,
            isCollapsed,
            globalSelectedRegion,
        };
    },
    template: `
    <div class="flex">
        <!-- Sidebar -->
        <side-bar @update:isCollapsed="updateSidebarCollapsed"></side-bar>
        <!-- Main content -->
        <router-view class="bg-[#f8f9fe] flex-1 mr-4 pl-4"></router-view>
    </div>
    `
});

// Register other components
app.component("chart-container", window.Highchart);
app.component("side-bar", window.Sidebar);
app.component('map-geojson', window.map_geojson);
app.component('ranking-cards', window.RankingCards);
app.component('filterable-dropdown', window.FilterableDropdown);

// Use modules
app.use(ElementPlus);
app.use(window.router);

// Mount the app
app.mount("#app");
