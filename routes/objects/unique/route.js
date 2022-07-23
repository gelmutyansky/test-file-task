const job = require('../../../handlers/objects/unique/handler');

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
            let data = await job.uploadUniqueFile(request.body);

            if (data.statusCode !== 200) {
                reply.status(400);
            }

            reply.send(data);
        },
    });

    fastify.route({
        method: 'POST',
        url:    '/delete',
        schema: {
            body:     {
                type:       'object',
                properties: {
                    objectId: { type: 'integer' },
                },
                required:   [ 'objectId' ],
            },
            response: {
                200: {
                    type:       'object',
                    properties: {
                        message:    {
                            type:       'object',
                            properties: {
                                success: { type: 'boolean' },
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
            let data = await job.deletingUniqueFile(request.body);

            if (data.statusCode !== 200) {
                reply.status(400);
            }

            reply.send(data);
        },
    });

    fastify.route({
        method: 'POST',
        url:    '/download',
        schema: {
            body:     {
                type:       'object',
                properties: {
                    objectId: { type: 'integer' },
                },
                required:   [ 'objectId' ],
            },
            response: {
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
            let data = await job.downloadUniqueFile(request.body);

            if (data.statusCode === 200) {
                reply.header('Content-Type', data.message.contentType);
                reply.send(data.message.buffer);
            }
            else {
                reply.status(400);
                reply.send(data);
            }
        },
    });

    next();
};