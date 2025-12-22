export function updateSRS(word, quality) {
    const ease = word.ease ?? 2.5;
    const interval = word.interval ?? 0;
    const MAX_INTERVAL = 180; // maximum interval of 6 months

    // 1. Update ease factor
    let newEase = ease + (0.1 - (3 - quality) * 0.08);
    if (newEase < 1.3) newEase = 1.3; // lower bound

    // 2. Update interval based on quality
    let newInterval;

    if (quality === 0) {
        newInterval = 1; // Forgot
        newEase -= 0.2;
    }
    else if (quality === 1) {
        newInterval = Math.max(1, Math.round(interval * 0.5)); // Hard
    }
    else {
        if (interval === 0) {
            newInterval = 1;
        } else if (interval === 1) {
            newInterval = 3;
        } else {
            newInterval = Math.round(interval * newEase);
        }
    }

    // Cap interval to MAX_INTERVAL
    newInterval = Math.min(newInterval, MAX_INTERVAL);

    // 3. Determine next review timestamp
    const now = new Date();
    const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

    return {
        ease: newEase,
        interval: newInterval,
        nextReview,
        lastReviewed: now,
        reviewCount: (word.reviewCount ?? 0) + 1,
    };
}
