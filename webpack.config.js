const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "main.js"
    },
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    // resolveLoader: { root: path.join(__dirname, "node_modules") },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.(js|ts|tsx)$/, loader: "ts-loader" }
        ]
    }
}
