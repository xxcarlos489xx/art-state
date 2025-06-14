import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
        // En el cliente, Bootstrap se adjunta al objeto window.
    }
});