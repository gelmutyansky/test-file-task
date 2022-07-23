const { pool, commonErrors, generatePath, readFile } = require('../../../dependes');
const fs = require('fs/promises');

/**
 * Загрузка уникального файла
 * @param { array } object.file
 * @param { Buffer } object.file[0].data
 * @param { string } object.file[0].filename
 * @param { number } object.objectId
 * @returns Promise<{message: {fileName: string}| string, statusCode: number}>
 * */
async function uploadUniqueFile(object) {
    let data = {
        message:    commonErrors.default,
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
                const { data: fileData, filename } = object.file[0];

                const path = generatePath(filename);

                await fs.writeFile(path, fileData);

                const queryUpdate = `UPDATE objects
                                     SET "fileUrl" = $1
                                     WHERE "objectId" = $2
                                     RETURNING REGEXP_REPLACE("fileUrl", '.+/', '') AS "fileName"`;
                const resUpdate = await client.query(queryUpdate, [ path, object.objectId ]);

                if (resUpdate.rowCount > 0 && resUpdate.rows.length > 0) {
                    const { fileName } = resUpdate.rows[0];

                    data = {
                        message:    {
                            fileName: fileName,
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
 * Функция для удаления уникального файла
 * @param { number } object.objectId
 * @returns Promise<{message: {success: boolean}| string, statusCode: number}>
 * */
async function deletingUniqueFile(object) {
    let data = {
        message:    commonErrors.default,
        statusCode: 400,
    };
    const client = await pool.connect();
    const funcName = 'deletingUniqueFile';
    const failed = `${ funcName }: failed.`;

    try {
        const querySelectObject = `SELECT "fileUrl"
                                   FROM objects
                                   WHERE "objectId" = $1`;
        const resSelectObject = await client.query(querySelectObject, [ object.objectId ]);

        if (resSelectObject.rows.length > 0) {
            const { fileUrl } = resSelectObject.rows[0];

            if (fileUrl) {
                const queryUpdate = `UPDATE objects
                                     SET "fileUrl" = NULL
                                     WHERE "objectId" = $1`;
                const resUpdate = await client.query(queryUpdate, [ object.objectId ]);

                if (resUpdate.rowCount > 0) {
                    data = {
                        message:    {
                            success: true,
                        },
                        statusCode: 200,
                    };

                    // Попробуем удалить файл. А если не получится, то пользователю не обязательно знать
                    try {
                        await fs.unlink(fileUrl);
                    } catch (e) {
                        console.log(`${ funcName }: file not deleted. Delete manually later!`);
                        console.log(`error message: ${ e.message }`);
                    }
                }
                else {
                    console.log(`${ failed } Objects not updated (objectId: ${ object.objectId })`);
                }
            }
            else {
                data.message = commonErrors.noFile;
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

async function downloadUniqueFile(object){
    let data = {
        message:    commonErrors.default,
        statusCode: 400,
    };
    const client = await pool.connect();
    const funcName = 'deletingUniqueFile';
    const failed = `${ funcName }: failed.`;

    try {
        const querySelectObject = `SELECT "fileUrl"
                                   FROM objects
                                   WHERE "objectId" = $1`;
        const resSelectObject = await client.query(querySelectObject, [ object.objectId ]);

        if (resSelectObject.rows.length > 0) {
            const { fileUrl } = resSelectObject.rows[0];

            if (fileUrl) {
                const { contentType, buffer } = await readFile(fileUrl);

                data = {
                    message:    {
                        contentType: contentType,
                        buffer:      buffer,
                    },
                    statusCode: 200,
                };
            }
            else {
                data.message = commonErrors.noFile;
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
    uploadUniqueFile:   uploadUniqueFile,
    deletingUniqueFile: deletingUniqueFile,
    downloadUniqueFile: downloadUniqueFile,
};