export const convertToRoman = (num) => { // for converting numbers to roman numerals 1-89
    if (num < 1) {
        return "";
    }
    if (num >= 50) {
        return "l" + convertToRoman(num - 50);
    }
    if (num >= 40) {
        return "xl" + convertToRoman(num - 40);
    }
    if (num >= 10) {
        return "x" + convertToRoman(num - 10);
    }
    if (num >= 9) {
        return "ix" + convertToRoman(num - 9);
    }
    if (num >= 5) {
        return "v" + convertToRoman(num - 5);
    }
    if (num >= 4) {
        return "iv" + convertToRoman(num - 4);
    }
    if (num >= 1) {
        return "i" + convertToRoman(num - 1);
    }
};
