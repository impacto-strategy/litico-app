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