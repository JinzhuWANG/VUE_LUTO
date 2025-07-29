window.Sidebar = {
  props: {},
  setup() {
    // Function to standardize SVG icons for consistent display
    const standardizeIcon = (icon) => {
      // Add a fixed viewBox to ensure consistent sizing
      return icon.replace('<svg', '<svg width="24" height="24"');
    };

    const navItems = [
      { id: "home", label: "Home", path: "/", icon: standardizeIcon(window.NavIcons.home) },
      { id: "area", label: "Area Analysis", path: "/area", icon: standardizeIcon(window.NavIcons.area) },
      { id: "production", label: "Production Analysis", path: "/production", icon: standardizeIcon(window.NavIcons.production) },
      { id: "economy", label: "Economy", path: "/economy", icon: standardizeIcon(window.NavIcons.economy) },
      { id: "GHG", label: "GHG Analysis", path: "/ghg", icon: standardizeIcon(window.NavIcons.GHG) },
      { id: "water", label: "Water Analysis", path: "/water", icon: standardizeIcon(window.NavIcons.water) },
      { id: "biodiversity", label: "Biodiversity", path: "/biodiversity", icon: standardizeIcon(window.NavIcons.biodiversity) },
      { id: "map", label: "Map View", path: "/map", icon: standardizeIcon(window.NavIcons.map) },
    ];

    const CommonIcons = {
      Expand: standardizeIcon(window.CommonIcons.Expand),
      Collapse: standardizeIcon(window.CommonIcons.Collapse),
    }

    const isCollapsed = Vue.ref(false);
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    // Get route info for highlighting active menu item
    const route = VueRouter.useRoute();
    const activeIndex = Vue.computed(() => {
      return route.path;
    });

    return {
      navItems,
      CommonIcons,
      isCollapsed,
      toggleCollapse,
      activeIndex,
    };
  },

  template: `
    <div :class="{'w-[100px]': isCollapsed, 'w-[280px]': !isCollapsed}">

      <!-- Logo and toggle button -->
      <div class="flex flex-row items-center py-4 mb-4 mt-6 px-4">
        <div v-if="!isCollapsed" class="flex-1 flex items-center overflow-hidden">
          <img src="resources/LUTO.png" alt="LUTO 2.0" class="rounded-full w-10 h-10 flex-shrink-0" />
          <span class="ms-3 text-xl font-semibold transition-opacity duration-300">LUTO 2.0</span>
        </div>
        <!-- Toggle button -->
        <div class="w-6 h-6 flex items-center justify-center min-w-[24px] cursor-pointer" @click="toggleCollapse">
          <span v-if="!isCollapsed" v-html="CommonIcons.Collapse" class="scale-90 flex items-center justify-center"></span>
          <span v-else v-html="CommonIcons.Expand" class="scale-90 flex items-center justify-center"></span>
        </div>
      </div>

      <!-- Menu -->
      <nav class="h-full">
        <ul class="list-none p-0 m-0">
          <li v-for="item in navItems" :key="item.id" class="transform transition-transform duration-300 ease-in-out">
            <router-link :to="item.path" class="flex px-4 py-3 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" 
              :class="{ 'bg-gray-50 border-l-4 border-blue-500': activeIndex === item.path }">
              <div class="w-6 h-6 flex items-center justify-center min-w-[24px] overflow-hidden"><span v-html="item.icon" class="scale-90 flex items-center justify-center"></span></div>
              <span v-if="!isCollapsed" class="ml-3 whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-300">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  `,
};
