const path = require('path');
const WebpackUserscript = require('webpack-userscript');

module.exports = {
    plugins: [
        new WebpackUserscript({
            headers: path.join(__dirname, './src/headers.json'),
            pretty: true
        })
    ],
    optimization: {
        minimize: false
    }
};