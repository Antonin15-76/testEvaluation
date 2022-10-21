import { useSnackbar as useSnackbarMUI } from 'notistack5'
import { useMemo } from 'react'

/**
 * @param {import('notistack5').OptionsObject} defaultOptions
 */
const useSnackbar = (defaultOptions = {}) => {
  const snackbar = useSnackbarMUI()
  console.log(snackbar)
  return useMemo(() => {
    const showMessage = (variant = 'default') => (texts, options = {}) => {
      const style = Object.assign({}, { whiteSpace: 'pre-line' }, defaultOptions, options)
      const message = Array.isArray(texts) ? texts.join('\n') : texts
      snackbar.enqueueSnackbar(message, { autoHideDuration: 1500, ...defaultOptions, ...options, style, variant })
    }
    return {
      ...snackbar,
      showMessage,
      showInfo: showMessage('info'),
      showSuccess: showMessage('success'),
      showWarning: showMessage('warning'),
      showError: showMessage('error')
    }
  }, [snackbar, defaultOptions])
}

export default useSnackbar
