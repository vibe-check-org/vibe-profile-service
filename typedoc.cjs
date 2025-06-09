/* global module */
/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    out: '.extras/doc/api',
    entryPoints: ['src'],
    entryPointStrategy: 'expand',
    excludePrivate: true,
    favicon: 'favicon.ico',
    validation: {
        invalidLink: true,
    },
};
