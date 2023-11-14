import { toast } from 'react-toastify'

function ToastFyWarning(message: string) {
  return toast.warning(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  })
}

export default ToastFyWarning
