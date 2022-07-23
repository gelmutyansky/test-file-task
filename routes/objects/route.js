const job = require('../../handlers/objects/handler');

module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'POST',
        url:    '/get',
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
            let data = await job.getObject(request.body);

            if (data.statusCode !== 200) {
                reply.status(400);
            }

            reply.send(data);
        },
    });

    next();
};