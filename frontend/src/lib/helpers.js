export function isObjectCheck(variable) {
    // https://stackoverflow.com/a/8511350
    return (typeof variable === 'object' &&
           !Array.isArray(variable) &&
           variable !== null);
};