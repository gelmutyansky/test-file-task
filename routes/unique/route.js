const job = require('../../handlers/unique/handler');

module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url:    '/get',
        schema: {
            query:   {
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
            let data = await job.getUniqueFile(request.query);

            if (data.statusCode !== 200) {
                reply.status(400);
            }

            reply.send(data);
        },

    });

    next();
};