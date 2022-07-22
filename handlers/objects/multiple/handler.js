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

/**
 * @param { number } object.objectId
 * @param { number } object.fileId
 * */
async function deleteFile(object) {
    let data = {
        message:    commonErrors.default,
        statusCode: 400,
    };
    const client = await pool.connect();
    const funcName = 'deleteFile';
    const failed = `${ funcName }: failed.`;

    try {
        const querySelectFile = `SELECT "fileUrl"
                                 FROM files
                                 WHERE "objectId" = $1
                                   AND "fileId" = $2`;
        const resSelectFile = await client.query(querySelectFile, [ object.objectId, object.fileId ]);

        if (resSelectFile.rows.length > 0) {
            const { fileUrl } = resSelectFile.rows[0];

            const queryDelete = `DELETE
                                 FROM files
                                 WHERE "objectId" = $1
                                   AND "fileId" = $2`;
            const resDelete = await client.query(queryDelete, [ object.objectId, object.fileId ]);

            if (resDelete.rowCount > 0) {
                data = {
                    message:    {
                        success: true,
                    },
                    statusCode: 200,
                };

                if (fileUrl) {
                    // Попробуем удалить файл. А если не получится, то пользователю не обязательно знать
                    try {
                        await fs.unlink(fileUrl);
                    } catch (e) {
                        console.log(`${ funcName }: file not deleted. Delete manually later!`);
                        console.log(`error message: ${ e.message }`);
                    }
                }
                else {
                    // Путь до файла пустой. Странно, но ладно
                }
            }
            else {
                console.log(`${ failed } File not deleted from (objectId: ${ object.objectId }, fileId: ${ object.fileId })`);
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
    deleteFile: deleteFile,
};