export function getLevel(lifetimeXp) {
    const LEVELS = [
        0,      // Level 1
        100,    // Level 2
        300,    // Level 3
        600,    // Level 4
        1000,   // Level 5
        1500,   // Level 6
        2100,   // Level 7
        2800,   // Level 8
        3600,   // Level 9
        4500,   // Level 10
        5500,   // Level 11
        6600,   // Level 12
        7800,   // Level 13
        9100,   // Level 14
        10500,  // Level 15
    ];
    let level = 1;

    for (let i = 0; i < LEVELS.length; i++) {
        if (lifetimeXp >= LEVELS[i]) {
            level = i + 1;
        }
    }

    const currentLevelXP = LEVELS[level - 1];
    const nextLevelXP = LEVELS[level] ?? LEVELS[LEVELS.length - 1] + 1000;

    const progress = (lifetimeXp - currentLevelXP) / (nextLevelXP - currentLevelXP);

    return { level, currentLevelXP, nextLevelXP, progress };
}
