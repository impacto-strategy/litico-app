const Dotenv = require('dotenv-webpack');

module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ],
            },
        ],
    },
    plugins: [
        new Dotenv({
            systemvars: true
        })
    ]
};