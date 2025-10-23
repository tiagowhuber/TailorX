// Google Identity Services types
export interface GoogleAccounts {
  id: {
    initialize: (config: GoogleIdConfiguration) => void
    prompt: (callback?: (notification: PromptMomentNotification) => void) => void
    renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void
  }
}

export interface GoogleIdConfiguration {
  client_id: string
  callback: (response: CredentialResponse) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}

export interface CredentialResponse {
  credential: string
  select_by?: string
}

export interface PromptMomentNotification {
  isDisplayMoment: () => boolean
  isDisplayed: () => boolean
  isNotDisplayed: () => boolean
  getNotDisplayedReason: () => string
  isSkippedMoment: () => boolean
  getSkippedReason: () => string
  isDismissedMoment: () => boolean
  getDismissedReason: () => string
  getMomentType: () => string
}

export interface GsiButtonConfiguration {
  type?: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: string
  locale?: string
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts
    }
  }
}
