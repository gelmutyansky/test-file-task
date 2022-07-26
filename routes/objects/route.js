const job = require('../../handlers/objects/handler');

module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url:    '/get',
        schema: {
            response: {
                200: {
                    type:       'object',
                    properties: {
                        message:    {
                            type:       'object',
                            properties: {
                                objects: {
                                    type:  'array',
                                    items: {
                                        type:       'object',
                                        properties: {
                                            objectId:   { type: 'integer' },
                                            objectName: { type: 'string' },
                                        },
                                    },
                                },
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
            let data = await job.getObjects();

            if (data.statusCode !== 200) {
                reply.status(400);
            }

            reply.send(data);
        }
    });

    fastify.route({
        method: 'GET',
        url:    '/get/:objectId',
        schema: {
            params:   {
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
                                unique:   { type: 'string' },
                                multiple: {
                                    type:  'array',
                                    items: {
                                        type:       'object',
                                        properties: {
                                            fileId:   { type: 'integer' },
                                            fileName: { type: 'string' },
                                        },
                                    },
                                },
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
            let data = await job.getObject(request.params);

            if (data.statusCode !== 200) {
                reply.status(400);
            }

            reply.send(data);
        },
    });

    next();
};