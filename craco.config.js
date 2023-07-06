const CracoLessPlugin = require('craco-less');
const Dotenv = require('dotenv-webpack');
const path = require('path');

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
                path: path.resolve(__dirname, './.env'),
                systemvars: true,
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