interface RateLimiter {
  check(ip: string): Promise<boolean>;
}

class InMemoryRateLimiter implements RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests = 3;
  private readonly windowMs = 60 * 60 * 1000; // 1 hour

  async check(ip: string): Promise<boolean> {
    const now = Date.now();
    const record = this.store.get(ip);

    if (!record || record.resetTime < now) {
      this.store.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count += 1;
    this.store.set(ip, record);
    return true;
  }
}

export const rateLimiter: RateLimiter = new InMemoryRateLimiter();
