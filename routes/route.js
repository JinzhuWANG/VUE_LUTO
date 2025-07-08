const { createRouter, createWebHashHistory } = VueRouter;

// Define routes
const routes = [
  { path: "/", component: window.HomeView },
  { path: "/area", component: window.AreaView },
  { path: "/economy", component: window.NotFound },
  { path: "/map", component: window.NotFound },
  { path: "/:pathMatch(.*)*", component: window.NotFound },
];

// Create router instance
window.router = createRouter({
  history: createWebHashHistory(),
  routes,
});
