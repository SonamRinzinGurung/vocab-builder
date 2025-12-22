export function getWordMastery(word) {
    const {
        reviewCount = 0,
        interval = 0,
        ease = 2.5,
    } = word;

    // 🌱 New
    if (reviewCount === 0) return 0;

    // 🌿 Learning
    if (reviewCount < 3 || interval < 3) return 1;

    // 🌳 Familiar
    if (
        reviewCount < 5 ||
        interval < 14 ||
        ease < 2.2
    ) {
        return 2;
    }

    // 🏔️ Mastered
    if (
        reviewCount >= 5 &&
        interval >= 21 &&
        ease >= 2.3
    ) {
        return 3;
    }

    // Fallback safety
    return 2;
}
