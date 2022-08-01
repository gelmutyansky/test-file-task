const { filesFolder } = require('./constants');

const path = require('path');
const mime = require('mime-types');
const fs = require('fs/promises');

/**
 * Получение пути до файла
 * @param { string } filename
 * @returns string
 * */
function generatePath(filename) {
    const timestamp = +(new Date());
    // ./public/16154565464somename_here.jpg
    return `${ filesFolder }/${ timestamp }${ filename.replace(/ /g, '_') }`;
}

async function readFile(fileUrl) {
    return {
        contentType: mime.contentType(path.extname(fileUrl)),
        buffer:      await fs.readFile(fileUrl),
    };
}

module.exports = {
    generatePath: generatePath,
    readFile:     readFile,
};