/**
 * Получение пути до файла
 * @param { string } filename
 * @returns string
 * */
function generatePath(filename) {
    const timestamp = +(new Date());
    // ./public/16154565464somename_here.jpg
    return `./public/${ timestamp }${ filename.replace(/ /g, '_') }`;
}

module.exports = {
    generatePath: generatePath,
};