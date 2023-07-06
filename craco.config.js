const CracoLessPlugin = require('craco-less');
const Dotenv = require('dotenv-webpack');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    webpack: {
        plugins: [
            new Dotenv({
                path: './.env', // Path to .env file (this is the default)
                systemvars: true
            })
        ],
        configure: webpackConfig => {
            return {
                ...webpackConfig,
                ignoreWarnings: [/Failed to parse source map/],
            }
        },
    },
};