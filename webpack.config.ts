import webpack from "webpack";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import path from 'path';

const isProduction = process.env['NODE_ENV'] === 'production';

const config: webpack.Configuration = {
    mode: isProduction ? 'production' : 'development',
    entry: path.join(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".csv"]
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: "ts-loader" },
        {
            test: /\.csv?$/,
            loader: "csv-loader",
            options: {
                dynamicTyping: true,
                header: true,
            },
        },
      ]
    }
};

export default config;
