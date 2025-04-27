// src/cache/loginCache.ts
interface LoginInfo {
    username: string;
    password: string;
    accessToken: string;
    transactionId: string;
  }
  
  const loginCache: Record<string, LoginInfo> = {};
  
  export default loginCache;
  