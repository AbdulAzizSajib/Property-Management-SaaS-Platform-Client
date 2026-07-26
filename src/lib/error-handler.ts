// src/lib/error-handler.ts বা utils/error.utils.ts

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  // যদি error object থাকে
  if (error && typeof error === 'object') {
    
    // 1. AppError থেকে message বের করা
    if ('message' in error && typeof error.message === 'string') {
      // সরাসরি message যদি থাকে
      return error.message;
    }
    
    // 2. Response error থেকে message বের করা
    if ('response' in error && error.response && typeof error.response === 'object') {
      const response = error.response as any;
      
      // response.data.message
      if (response.data?.message && typeof response.data.message === 'string') {
        return response.data.message;
      }
      
      // response.data.error
      if (response.data?.error && typeof response.data.error === 'string') {
        return response.data.error;
      }
      
      // response.message
      if (response.message && typeof response.message === 'string') {
        return response.message;
      }
    }
    
    // 3. Error instance এর message
    if (error instanceof Error) {
      return error.message;
    }
    
    // 4. error.message property
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }
  
  // 5. যদি কিছুই না পাওয়া যায়
  return fallbackMessage;
}