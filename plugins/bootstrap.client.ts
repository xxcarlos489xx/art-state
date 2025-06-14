// Importamos el bundle completo. Esto se encargará de inicializar
// todos los componentes de Bootstrap (dropdowns, modals, etc.)
// que encuentren los atributos data-bs-* en el DOM.
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default defineNuxtPlugin((nuxtApp) => {
    // No es estrictamente necesario proveer nada si solo
    // dependes de la inicialización por atributos data-bs-*.
    // Pero si quieres acceder a `new window.bootstrap.Modal()` como
    // hicimos antes, es bueno verificar que exista.
    if (process.client) {
        // En el cliente, Bootstrap se adjunta al objeto window.
        // No necesitamos hacer nada más.
    }
});