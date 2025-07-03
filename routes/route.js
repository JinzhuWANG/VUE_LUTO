const { createRouter, createWebHashHistory } = VueRouter;

// Define routes
const routes = [
  { path: "/", component: window.HomeView },
  { path: "/area", component: window.AreaView },
  {
    path: "/economy",
    component: {
      template: `
      <div class="p-6">
        <h1 class="text-2xl font-bold">Economy Analysis</h1>
        <p>Economy content coming soon...</p>
      </div>
    `,
    },
  },
  {
    path: "/map",
    component: {
      template: `
      <div class="p-6">
        <h1 class="text-2xl font-bold">Map View</h1>
        <p>Map content coming soon...</p>
      </div>
    `,
    },
  },
  { path: "/:pathMatch(.*)*", component: window.NotFound },
];

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
