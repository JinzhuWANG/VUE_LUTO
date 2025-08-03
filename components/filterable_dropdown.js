// Define the FilterableDropdown component
window.FilterableDropdown = {
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    modelValue: {
      type: String,
      default: ''
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false,
      selectedItem: this.modelValue,
      searchTerm: '',
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchTerm) return this.items;

      return this.items.filter(item =>
        item.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.selectedItem = newValue;
      }
    }
  },
  mounted() {
    document.addEventListener('mousedown', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      if (this.$refs.dropdownRef && !this.$refs.dropdownRef.contains(event.target)) {
        this.isOpen = false;
      }
    },
    handleItemSelect(item) {
      this.selectedItem = item;
      this.isOpen = false;
      this.searchTerm = '';
      this.$emit('update:modelValue', item);
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    clearSearch() {
      this.searchTerm = '';
    }
  },
  template: `
    <div class="relative" ref="dropdownRef">
      <!-- Main dropdown trigger -->
      <button
        @click="toggleDropdown"
        class="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div class="flex items-center justify-between">
          <span :class="selectedItem ? 'text-gray-900' : 'text-gray-500'">
            {{ selectedItem || 'Select a region...' }}
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-gray-400 transition-transform" :class="isOpen ? 'rotate-180' : ''">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </button>

      <!-- Dropdown content -->
      <div v-if="isOpen" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
        <!-- Search input -->
        <div class="p-3 border-b border-gray-200">
          <div class="relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search regions..."
              v-model="searchTerm"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Items list -->
        <div class="max-h-80 overflow-y-auto">
          <div v-if="filteredItems.length > 0" class="py-1">
            <button
              v-for="(item, index) in filteredItems"
              :key="index"
              @click="handleItemSelect(item)"
              class="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
            >
              <span class="block text-gray-900">{{ item }}</span>
            </button>
          </div>
          <div v-else class="px-4 py-8 text-center text-gray-500">
            <template v-if="searchTerm">
              No items found for "{{ searchTerm }}"
              <div class="mt-2">
                <button
                  @click="clearSearch"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear search
                </button>
              </div>
            </template>
            <template v-else>
              No items available
            </template>
          </div>
        </div>

      </div>

      
    </div>
  `
};