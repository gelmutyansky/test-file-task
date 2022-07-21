const { pool } = require('../../dependes');

/**
 * Получение файла объекта, который единственный
 * @param { number } object.objectId
 * @returns Promise<{message: { url: string } | string, statusCode: number}>
 * */
async function getUniqueFile(object) {
    let data = {
        message:    'ERROR',
        statusCode: 400,
    };
    let client = await pool.connect();

    try {
        const queryFile = `SELECT "fileUrl"
                           FROM objects
                           WHERE "objectId" = $1`;
        const resFile = await client.query(queryFile, [ object.objectId ]);

        if (resFile.rows.length > 0) {
            data = {
                message:    {
                    url: resFile.rows[0].url,
                },
                statusCode: 200,
            };
        }
        else {
            data.message = 'NO OBJECT FOUND';
        }
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
    getUniqueFile: getUniqueFile,
};