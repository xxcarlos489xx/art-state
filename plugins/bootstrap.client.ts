import { Toast, Tooltip } from "bootstrap";
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default defineNuxtPlugin(() => ({
  provide: {
    bootstrap: {
      Toast,
      Tooltip,
    },
  },
}));
