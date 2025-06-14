import { Modal, Tooltip, Toast } from 'bootstrap';

declare global {
  interface Window {
    bootstrap: {
      Modal: typeof Modal;
      Tooltip: typeof Tooltip;
      Toast: typeof Toast;
    };
  }
}

export {};