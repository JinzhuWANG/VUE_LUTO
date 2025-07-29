window.Sidebar = {
  props: {},
  setup() {
    const navItems = [
      { id: "home", label: "Home", path: "/", icon: window.Icon.home },
      { id: "area", label: "Area Analysis", path: "/area", icon: window.Icon.area },
      { id: "production", label: "Production Analysis", path: "/production", icon: window.Icon.production },
      { id: "economy", label: "Economy", path: "/economy", icon: window.Icon.economy },
      { id: "GHG", label: "GHG Analysis", path: "/ghg", icon: window.Icon.GHG },
      { id: "water", label: "Water Analysis", path: "/water", icon: window.Icon.water },
      { id: "biodiversity", label: "Biodiversity", path: "/biodiversity", icon: window.Icon.biodiversity },
      { id: "map", label: "Map View", path: "/map", icon: window.Icon.map },
    ];

    // Check if window.Icon exists
    if (!window.Icon) {
      console.error("window.Icon is not defined. Make sure icons.js is loaded.");
    }

    const isDropdownOpen = Vue.ref(false);
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    return {
      navItems,
      isDropdownOpen,
      toggleDropdown,
    };
  },

  template: ` 
    <div class="bg-white">
      <div class="flex items-center ml-1 py-4 mb-4 mt-6">
        <img src="resources/LUTO.png" alt="LUTO 2.0" class="rounded-full w-10 h-10" />
        <span class="ms-3 text-xl font-semibold">LUTO 2.0</span>
      </div>
      <div class="overflow-y-auto flex-1">
        <ul class="space-y-3 font-medium">
          <!-- Loop through navItems -->
          <li v-for="item in navItems" :key="item.id">
            <router-link 
              :to="item.path" 
              class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <!-- Dynamically access icons -->
              <span v-html="JSON.parse(JSON.stringify(item.icon))"></span>
              <span class="ms-3 w-[200px] whitespace-nowrap">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  `,
};
