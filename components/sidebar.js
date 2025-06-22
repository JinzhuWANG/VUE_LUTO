window.Sidebar = {
  props: {},
  setup() {
    const navItems = [
      { id: "home", label: "Home", path: "/" },
      { id: "area", label: "Area Analysis", path: "/area" },
      { id: "economy", label: "Economy", path: "/economy" },
      { id: "map", label: "Map View", path: "/map" },
    ];

    return {
      navItems,
    };
  },
  template: `
    <div class="w-[250px] bg-[#212120] min-h-screen p-4 shadow-md">
      <h2 class="text-xl font-bold mb-6">Dashboard</h2>
      <ul>
        <li v-for="item in navItems" :key="item.id" class="mb-2">
          <router-link 
            :to="item.path"
            class="w-full py-2 px-4 text-left rounded transition block text-[#bdbdbd] hover:text-gray-100"
            active-class="text-green-400">
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
  `,
};
