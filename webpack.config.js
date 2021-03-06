const path = require("path")
const webpack = require("webpack")

function findParam(param){
    let result = null
    process.argv.forEach(argv => {
        if(argv.indexOf('--' + param) === -1) return
        result = argv.split('=')[1];
    })
    return result
}

const serverHost = findParam('serverHost') || 'localhost'
const serverPort = findParam('serverPort') || 7777

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname,'src','client'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    devServer:{
        historyApiFallback: true
    },
    module: {
        rules:[{
            test: /\.jsx?$/,
            use: 'babel-loader'
        }, {
            test: /\.css$/, 
            use: ['style-loader','css-loader']
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: 'file-loader'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({ 
            serverHost: JSON.stringify(serverHost),
            serverPort: JSON.stringify(serverPort)
        })
    ]
}