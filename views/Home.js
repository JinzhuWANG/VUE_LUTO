window.HomeView = {
    setup() {
        const message = Vue.ref('Welcome to Home Dashboard')

        return {
            message
        }
    },
    template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Dashboard Home</h1>
      <div class="bg-blue-500 text-white p-4 rounded">
        {{ message }}
      </div>
      
      <div class="mt-6">
        <p>Select an option from the sidebar to view different analyses.</p>
      </div>
    </div>
  `
}