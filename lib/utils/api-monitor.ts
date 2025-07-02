// API Monitoring and Logging Utilities

export interface APICallMetrics {
  model: string
  startTime: number
  endTime?: number
  duration?: number
  success: boolean
  error?: string
  tokens?: number
  retryCount?: number
}

export class APIMonitor {
  private static metrics: APICallMetrics[] = []

  static startCall(model: string): APICallMetrics {
    const metric: APICallMetrics = {
      model,
      startTime: Date.now(),
      success: false,
    }
    
    this.metrics.push(metric)
    return metric
  }

  static endCall(metric: APICallMetrics, success: boolean, error?: string, tokens?: number) {
    metric.endTime = Date.now()
    metric.duration = metric.endTime - metric.startTime
    metric.success = success
    metric.error = error
    metric.tokens = tokens

    // Log the call
    if (success) {
      console.log(`✅ AI API Call successful: ${metric.model} (${metric.duration}ms)`)
    } else {
      console.error(`❌ AI API Call failed: ${metric.model} (${metric.duration}ms) - ${error}`)
    }
  }

  static getMetrics(): APICallMetrics[] {
    return [...this.metrics]
  }

  static getRecentMetrics(minutes: number = 5): APICallMetrics[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.metrics.filter(m => m.startTime > cutoff)
  }

  static getSuccessRate(minutes: number = 60): number {
    const recent = this.getRecentMetrics(minutes)
    if (recent.length === 0) return 1

    const successful = recent.filter(m => m.success).length
    return successful / recent.length
  }

  static shouldUseBackup(): boolean {
    // Use backup if recent success rate is below 50%
    return this.getSuccessRate(5) < 0.5
  }

  static clearOldMetrics(hours: number = 24) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000)
    this.metrics = this.metrics.filter(m => m.startTime > cutoff)
  }
}

// Rate limiting utility
export class RateLimiter {
  private static calls: Map<string, number[]> = new Map()

  static canMakeCall(key: string, maxCalls: number, windowMs: number): boolean {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!this.calls.has(key)) {
      this.calls.set(key, [])
    }
    
    const calls = this.calls.get(key)!
    
    // Remove old calls outside the window
    const validCalls = calls.filter(time => time > windowStart)
    this.calls.set(key, validCalls)
    
    return validCalls.length < maxCalls
  }

  static recordCall(key: string) {
    if (!this.calls.has(key)) {
      this.calls.set(key, [])
    }
    
    this.calls.get(key)!.push(Date.now())
  }

  static getCallCount(key: string, windowMs: number): number {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!this.calls.has(key)) {
      return 0
    }
    
    const calls = this.calls.get(key)!
    return calls.filter(time => time > windowStart).length
  }
}

// Retry utility with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay
      const finalDelay = delay + jitter

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} in ${Math.round(finalDelay)}ms`)
      
      await new Promise(resolve => setTimeout(resolve, finalDelay))
    }
  }

  throw lastError
}
