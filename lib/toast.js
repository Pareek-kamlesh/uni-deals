import { toast } from 'react-toastify';

export const showToast = (type, message, options = {}) => {
  const defaultOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options, // Override default options if provided
  };

  switch (type) {
    case 'success':
      toast.success(message, defaultOptions);
      break;
    case 'error':
      toast.error(message, defaultOptions);
      break;
    case 'info':
      toast.info(message, defaultOptions);
      break;
    case 'warning':
      toast.warn(message, defaultOptions);
      break;
    default:
      toast(message, defaultOptions);
  }
};
