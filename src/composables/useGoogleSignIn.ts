import { ref, onMounted } from 'vue'
import type { GsiButtonConfiguration } from '@/types/google.d'

export function useGoogleSignIn() {
  const isGoogleLoaded = ref(false)

  onMounted(() => {
    // Check if Google library is loaded
    const checkGoogleLoaded = setInterval(() => {
      if (window.google?.accounts) {
        isGoogleLoaded.value = true
        clearInterval(checkGoogleLoaded)
      }
    }, 100)

    // Clear interval after 5 seconds to prevent infinite checking
    setTimeout(() => clearInterval(checkGoogleLoaded), 5000)
  })

  const renderGoogleButton = (
    elementId: string,
    callback: (credential: string) => void,
    options?: GsiButtonConfiguration
  ) => {
    if (!window.google?.accounts) {
      console.error('Google Sign-In library not loaded')
      return
    }

    const element = document.getElementById(elementId)
    if (!element) {
      console.error(`Element with id "${elementId}" not found`)
      return
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        callback(response.credential)
      },
    })

    window.google.accounts.id.renderButton(
      element,
      options || {
        type: 'standard',
        theme: 'filled_blue',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      }
    )
  }

  return {
    isGoogleLoaded,
    renderGoogleButton,
  }
}
