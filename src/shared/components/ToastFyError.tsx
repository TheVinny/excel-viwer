import { toast } from 'react-toastify'

function ToastFyError(message: string) {
  return toast.error(message, {
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

export default ToastFyError
