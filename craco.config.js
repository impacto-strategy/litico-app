const CracoLessPlugin = require('craco-less');

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
        configure: webpackConfig => {
            return {
                ...webpackConfig,
                ignoreWarnings: [/Failed to parse source map/],
            }
        },
    },
};