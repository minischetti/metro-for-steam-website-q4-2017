const webpack = require("webpack");
const path = require('path');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: ["./src/index.js"],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",
        // publicPath: "assets"
    },
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react']
                    }
                }
            },
            // {
            //     test: /\.sass$/,
            //     use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            // },
            // {
            //     test: /\.(png|jpg|svg)$/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {}
            //         }
            //     ]
            // }
        ],
    },
    plugins: [
        // new ExtractTextPlugin("styles.css"),
    ]
}