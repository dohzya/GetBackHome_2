module.exports = {
    entry: './src/index',
    output: {
        path: __dirname,
        filename: 'main.js'
    },
    devtool: 'source-map',
    resolve: {
        root: __dirname,
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                  presets: ['es2015']
                }
            }
        ]
    }
}
