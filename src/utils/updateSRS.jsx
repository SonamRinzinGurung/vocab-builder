export function updateSRS(word, quality) {
    const ease = word.ease ?? 2.5;
    const interval = word.interval ?? 0;

    // 1. Update ease factor
    let newEase = ease + (0.1 - (3 - quality) * 0.08);
    if (newEase < 1.3) newEase = 1.3; // lower bound

    // 2. Update interval based on quality
    let newInterval;

    if (quality < 2) {
        // Forgot or Hard → short interval
        newInterval = 1;
    } else {
        if (interval === 0) {
            newInterval = 1;
        } else if (interval === 1) {
            newInterval = 3;
        } else {
            newInterval = Math.round(interval * newEase);
        }
    }

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
