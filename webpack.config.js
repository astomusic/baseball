const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer({
  ssr: false,
});

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 8080;
const glob = require('glob');

module.exports = env => {
  return {
    mode: !!process.env.WEBPACK_DEV_SERVER || env.env === 'dev' ? 'development' : 'production',
    entry: ['./src/index.tsx'].concat(glob.sync('./public/docs/**/*.png')),
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
    output: {
      publicPath: '/',
      path: __dirname + '/dist',
      chunkFilename: 'static/[name].[chunkhash].js',
      filename: 'static/bundle.[hash].js',
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          loader: 'tslint-loader',
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            getCustomTransformers: () => ({
              before: [styledComponentsTransformer],
            }),
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.(png|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(md)$/,
          use: [
            {
              loader: 'raw-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src/'),
        images: path.resolve(__dirname, 'public/images'),
        fonts: path.resolve(__dirname, 'public/fonts'),
        docs: path.resolve(__dirname, 'public/docs'),
      },
      extensions: ['.ts', '.tsx', '.js', 'jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        dev: !!process.env.WEBPACK_DEV_SERVER || env.env === 'dev',
      }),
    ],
    devServer: {
      host: 'localhost',
      port: port,
      open: true,
      historyApiFallback: true,
    },
  };
};
