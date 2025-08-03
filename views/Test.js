window.Test = {
    components: {
        FilterableDropdown: FilterableDropdown // Reference the global component directly
    },
    template: `
    <div class="max-w-[280px] h-[100px] p-6 justify-center items-center bg-grey-700 rounded-lg shadow-md">
      <h2 class="text-sm font-bold mb-2">Select a region</h2>
      <FilterableDropdown/>
    </div>
  `
};