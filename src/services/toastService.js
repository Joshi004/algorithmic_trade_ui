import toast from 'react-hot-toast';

/**
 * Toast Service using react-hot-toast
 * Provides consistent toast notifications across the application
 */
class ToastService {
  /**
   * Show success toast
   * @param {string} message - Main message
   * @param {string} header - Optional header (will be prepended to message)
   * @param {number} duration - Duration in milliseconds (default: 4000)
   */
  success(message, header = '', duration = 4000) {
    const fullMessage = header ? `${header}: ${message}` : message;
    return toast.success(fullMessage, {
      duration,
      position: 'top-right',
    });
  }

  /**
   * Show error toast
   * @param {string} message - Main message
   * @param {string} header - Optional header (will be prepended to message)
   * @param {number} duration - Duration in milliseconds (default: 6000)
   */
  error(message, header = '', duration = 6000) {
    const fullMessage = header ? `${header}: ${message}` : message;
    return toast.error(fullMessage, {
      duration,
      position: 'top-right',
    });
  }

  /**
   * Show warning toast
   * @param {string} message - Main message
   * @param {string} header - Optional header (will be prepended to message)
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  warning(message, header = '', duration = 5000) {
    const fullMessage = header ? `${header}: ${message}` : message;
    return toast(fullMessage, {
      duration,
      position: 'top-right',
      icon: '⚠️',
    });
  }

  /**
   * Show info toast
   * @param {string} message - Main message
   * @param {string} header - Optional header (will be prepended to message)
   * @param {number} duration - Duration in milliseconds (default: 5000)
   */
  info(message, header = '', duration = 5000) {
    const fullMessage = header ? `${header}: ${message}` : message;
    return toast(fullMessage, {
      duration,
      position: 'top-right',
      icon: 'ℹ️',
    });
  }

  /**
   * Show loading toast
   * @param {string} message - Loading message
   * @param {string} header - Optional header
   */
  loading(message, header = '') {
    const fullMessage = header ? `${header}: ${message}` : message;
    return toast.loading(fullMessage, {
      position: 'top-right',
    });
  }

  /**
   * Dismiss a specific toast
   * @param {string} toastId - Toast ID returned from toast methods
   */
  dismiss(toastId) {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    toast.dismiss();
  }

  /**
   * Show a promise-based toast (for async operations)
   * @param {Promise} promise - Promise to track
   * @param {Object} messages - Object with loading, success, and error messages
   * @param {Object} options - Additional options
   */
  promise(promise, messages, options = {}) {
    return toast.promise(promise, messages, {
      position: 'top-right',
      ...options,
    });
  }
}

// Export singleton instance
const toastService = new ToastService();
export default toastService; 