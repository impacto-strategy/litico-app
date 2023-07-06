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
    module: {
      rules: [
        {
          test: /\.less$/i,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new Dotenv({
        systemvars: true,
      }),
    ],
    configure: (webpackConfig) => {
      return {
        ...webpackConfig,
        ignoreWarnings: [/Failed to parse source map/],
      };
    },
  },
};