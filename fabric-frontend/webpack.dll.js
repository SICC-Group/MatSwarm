const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outDir = path.resolve(__dirname, './dist/static/webpack/dll/');
const mgeProjectRoot = path.resolve(__dirname, './dist');

module.exports = (env, argv) => {
  const devMode = (argv.mode === 'development');
  const config = {
    output: {
      path: outDir,
      filename: 'dll.js',
      library: 'dll_library',
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          parallel: true,
          uglifyOptions: {
            output: { comments: false },
          },
        }),
      ]
    },
    entry: {
      dll: ['react', 'react-dom', 'react-router', 'react-router-dom']
    },
    stats: {
      errorDetails: true,
      // children: false,
      // modules: false,
      // entrypoints: false,
      // builtAt: false,
      // hash: false,
      // timings: false,
      // version: false,
    },
    plugins: [
      new webpack.DllPlugin({
        // path: '../static/webpack/dll/manifest.json',
        // path: path.resolve(__dirname, './dist/static/webpack/dll/manifest.json'),
        path: './manifest.json',
        name: 'dll_library',
        context: __dirname,
      }),
      new CleanWebpackPlugin({
        // cleanOnceBeforeBuildPatterns: [path.join(process.cwd(), '../static/webpack/dll/**/*')],
        dangerouslyAllowCleanPatternsOutsideProject: true,
        dry: false,
      }),
    ],
  };
  return config;
}
