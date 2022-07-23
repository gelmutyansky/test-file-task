const { pool } = require('../../dependes');

/**
 * @param { number } object.objectId
 * @returns Promise<{ message: {unique: string, multiple: Array<{ fileId: number, fileName: string }>} | string, statusCode: number}>
 * */
async function getObject(object) {
    let data = {
        message:    'ERROR',
        statusCode: 400,
    };
    let client = await pool.connect();

    try {
        const querySelectObject = `SELECT REGEXP_REPLACE("fileUrl", '.+/', '') AS "fileName"
                                   FROM objects
                                   WHERE "objectId" = $1`;
        const resSelectObject = await client.query(querySelectObject, [ object.objectId ]);

        if (resSelectObject.rows.length > 0) {
            const { fileName } = resSelectObject.rows[0];

            const querySelectFiles = `SELECT "fileId",
                                             REGEXP_REPLACE("fileUrl", '.+/', '') AS "fileName"
                                      FROM files
                                      WHERE "objectId" = $1
                                      ORDER BY "fileId"`;
            const resSelectFile = await client.query(querySelectFiles, [ object.objectId ]);

            data = {
                message:    {
                    unique:   fileName,
                    multiple: resSelectFile.rows,
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
    getObject: getObject,
};