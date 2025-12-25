import Swal from 'sweetalert2';

/**
 * 🔔 Common SweetAlert handler
 */
export const showAlert = ({
  type = 'info',        // info | success | warning | error | question
  title = '',
  text = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
}) => {
  return Swal.fire({
    icon: type,
    title,
    text,
    showCancelButton: showCancel,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor:
      type === 'error' ? '#dc2626' :
      type === 'warning' ? '#f59e0b' :
      '#2563eb',
    cancelButtonColor: '#6b7280',
  });
};
