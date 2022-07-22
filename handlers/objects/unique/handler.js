const { pool } = require('../../../dependes');

async function uploadUniqueFile(object) {
    let data = {
        message:    'ERROR',
        statusCode: 400,
    };
    const client = pool.connect();

    try {
        console.log('breakpoint');
    } catch (e) {
        console.error(e.stack, e.message);
        data = {
            message:    e.message,
            statusCode: 400,
        };
    } finally {
        client.release();
        console.log('Release client');
    }

    return data;
}

module.exports = {
    uploadUniqueFile: uploadUniqueFile,
};