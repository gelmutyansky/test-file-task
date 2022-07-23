const job = require('../../../handlers/objects/multiple/handler');

module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'POST',
        url:    '/upload',
        schema: {
            body:     {
                type:       'object',
                properties: {
                    objectId: { type: 'integer' },
                    file:     {
                        type:  'array',
                        items: fastify.getSchema('MultipartFileType'),
                    },
                },
                required:   [ 'objectId', 'file' ],
            },
            response: {
                200: {
                    type:       'object',
                    properties: {
                        message:    {
                            type:       'object',
                            properties: {
                                fileId:   { type: 'integer' },
                                fileName: { type: 'string' },
                            },
                        },
                        statusCode: { type: 'integer' },
                    },
                },
                400: {
                    type:       'object',
                    properties: {
                        message:    { type: 'string' },
                        statusCode: { type: 'integer' },
                    },
                },
            },
        },
        async handler(request, reply) {
            let data = await job.uploadFile(request.body);

            if (data.statusCode !== 200) {
                reply.status(400);
            }

            reply.send(data);
        },
    });

    next();
};