const { pool } = require('../../../dependes');
const fs = require('fs/promises');

/**
 * Загрузка уникального файла
 * @param { array } object.file
 * @param { Buffer } object.file[0].data
 * @param { string } object.file[0].filename
 * @param { number } object.objectId
 * @returns Promise<{message: {fileUrl: string}| string, statusCode: number}>
 * */
async function uploadUniqueFile(object) {
    let data = {
        message:    'ERROR',
        statusCode: 400,
    };
    const client = await pool.connect();
    const funcName = 'uploadUniqueFile';
    const failed = `${ funcName }: failed.`;

    try {
        const queryExistObject = `SELECT "fileUrl"
                                  FROM objects
                                  WHERE "objectId" = $1`;
        const resExistObject = await client.query(queryExistObject, [ object.objectId ]);

        if (resExistObject.rows.length > 0) {
            const { fileUrl } = resExistObject.rows[0];

            if (fileUrl) {
                data.message = 'FILE NOT DELETED';
            }
            else {
                const timestamp = +(new Date());

                const { data: fileData, filename } = object.file[0];

                const path = `./public/${ timestamp }${ filename.replace(/ /g, '_') }`;

                await fs.writeFile(path, fileData);

                const queryUpdate = `UPDATE objects
                                     SET "fileUrl" = $1
                                     WHERE "objectId" = $2`;
                const resUpdate = await client.query(queryUpdate, [ path, object.objectId ]);

                if (resUpdate.rowCount > 0) {
                    data = {
                        message:    {
                            fileUrl: path,
                        },
                        statusCode: 200,
                    };
                }
                else {
                    console.log(`${ failed } Object not updated. Deleting file... (objectId: ${ object.objectId }, path: ${ path })`);

                    await fs.unlink(path);
                }
            }
        }
        else {
            data.message = 'NO OBJECT';
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
    uploadUniqueFile: uploadUniqueFile,
};