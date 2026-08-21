// TOKEN BUCKET CLASS 

class TokenBucket {
    constructor(capacity, refillRate) {
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

module.exports = TokenBucket