var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
  name: 'client',
  target: 'web',
  entry: './demo/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        // vue-loader options go here
        loaders: {
          css: ExtractTextPlugin.extract({
            loader: 'css-loader?sourceMap',
            fallbackLoader: 'vue-style-loader'
          })
        }
      }
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
      loader: 'url-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    },
    {
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader",
        "postcss-loader"
      ]
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: path.resolve(__dirname, './demo/index.html'),
      inject: true
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      },
      vue: {
        postcss: function () {
          return [autoprefixer]
        }
      }
    }),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dll/vendor-manifest.json')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new AddAssetHtmlPlugin({ filepath: path.resolve(__dirname, 'dll/vendor_dll.js'), publicPath: 'dll', outputPath: 'dll', includeSourcemap: false })
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    },
    extensions: ['css', '.js', '.vue']
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    stats: {
      colors: true,
      chunks: false
    },
    noInfo: false,
    inline: true,
    hot: true
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"'
    //   }
    // }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}