const { createRouter, createWebHashHistory } = VueRouter;

// Define routes
const routes = [
  { path: "/", component: window.HomeView },
  { path: "/area", component: window.AreaView },
  { path: "/settings", component: window.SettingsView },
  { path: "/economy", component: window.NotFound },
  { path: "/map", component: window.NotFound },
  { path: "/test", component: window.Test },
  { path: "/:pathMatch(.*)*", component: window.NotFound },
];

// Create router instance
window.router = createRouter({
  history: createWebHashHistory(),
  routes,
});
