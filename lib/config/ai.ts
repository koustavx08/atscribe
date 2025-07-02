// AI Configuration
export const AI_CONFIG = {
  // Primary model (higher quality, higher cost)
  PRIMARY_MODEL: "gemini-1.5-pro",
  
  // Fallback model (faster, lower cost)
  FALLBACK_MODEL: "gemini-1.5-flash",
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY_BASE: 1000, // Base delay in milliseconds
  
  // Rate limiting
  DEFAULT_RETRY_AFTER: 60, // Default retry delay in seconds
  
  // Error messages
  QUOTA_ERROR_MESSAGE: "API quota exceeded. Please try again later.",
  GENERAL_ERROR_MESSAGE: "Failed to generate resume content. Please try again.",
} as const

export type AIModel = typeof AI_CONFIG.PRIMARY_MODEL | typeof AI_CONFIG.FALLBACK_MODEL
