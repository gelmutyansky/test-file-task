const { pool, commonErrors, generatePath } = require('../../../dependes');
const fs = require('fs/promises');

/**
 * Загрузка множественного файла
 * @param { array } object.file
 * @param { Buffer } object.file[0].data
 * @param { string } object.file[0].filename
 * @param { number } object.objectId
 * @returns Promise<{message: {fileUrl: string}| string, statusCode: number}>
 * */
async function uploadFile(object) {
    let data = {
        message:    commonErrors.default,
        statusCode: 400,
    };
    const client = await pool.connect();
    const funcName = 'uploadFile';
    const failed = `${ funcName }: failed.`;

    try {
        const queryExistObject = `SELECT "objectId"
                                  FROM objects
                                  WHERE "objectId" = $1`;
        const resExistObject = await client.query(queryExistObject, [ object.objectId ]);

        if (resExistObject.rows.length > 0) {
            const { data: fileData, filename } = object.file[0];

            const path = generatePath(filename);

            await fs.writeFile(path, fileData);

            const queryInsert = `INSERT INTO files ("objectId", "fileUrl")
                                 VALUES ($1, $2)`;
            const resInsert = await client.query(queryInsert, [ object.objectId, path ]);

            if (resInsert.rowCount > 0) {
                data = {
                    message:    {
                        fileUrl: path,
                    },
                    statusCode: 200,
                };
            }
            else {
                console.log(`${ failed } File not inserted. Deleting file... (objectId: ${ object.objectId }, path: ${ path })`);

                await fs.unlink(path);
            }
        }
        else {
            data.message = commonErrors.noObject;
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
    uploadFile: uploadFile,
};