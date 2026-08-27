// TOKEN BUCKET CLASS 

class TokenBucket {
    private capacity: number; // Maximum tokens in the bucket
    private tokens: number; // Current tokens in the bucket
    private refillRate: number; // Tokens to add per second
    private lastRefillTime: number; // Last time tokens were added

    constructor(capacity : number, refillRate: number) {
        this.capacity = capacity;
        this.tokens = capacity; // Start full
        this.refillRate = refillRate;
        this.lastRefillTime = Date.now()      
    }
    refill() {
        const now = Date.now();
        const elapsed = (now - this.lastRefillTime) / 1000 // Convert to seconds
        const newTokens = elapsed * this.refillRate;
        this.tokens = Math.min(this.capacity, this.tokens + newTokens);
        this.lastRefillTime = now;
    }
    allowRequest() {
        this.refill();
        if (this.tokens > 0) {
            this.tokens--;
            return true;
        }
        return false;
    }
}

export default TokenBucket