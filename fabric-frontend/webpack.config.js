const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const request = require('request');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 输出目录
const outDir = path.resolve(__dirname, '/dist/static/webpack/');
// 入口点

function GetEntry(devMode) {
  const entry = {
    index: './entry/search_v2.tsx', // 改为搜索页
    // export_data: devMode ? './entry/export_data_v2.tsx' : './entry/export_data.tsx', // 数据导出页
    export_data: './entry/export_data_v2.tsx',
    // analytics: './entry/analytics.tsx', // 统计页
    // task: './entry/task.ts', // 任务页
    // task: './entry/task.tsx',     // 任务页
    // feedback_list:'./entry/feedbacklist.tsx',//反馈单列表页
    upload_history: './entry/upload_history.tsx', // 新版上传历史页面
    // search: devMode ? './entry/search_v2.tsx' : './entry/search.tsx', // 搜索页
    search: './entry/search_v2.tsx',
    // expr_search: './entry/expr_search.tsx', // 高级搜索页
    show_data: './entry/show_data.tsx',// 数据展示页
    login: './entry/login.tsx', // 登录页
    signup: './entry/signup.jsx', // 注册页
    create_template: './entry/create_template.tsx', // 上传模板页
    edit_template: './entry/edit_template.tsx', // 编辑模板页
    check_template: './entry/check_template.tsx', //查看模板页
    edit_snippet:'./entry/edit_template.tsx',//编辑模板片段页
    check_snippet:'./entry/check_template.tsx',//查看模板片段页
    upload_data: './entry/upload_data.tsx',
    // temp: './entry/temp.tsx', // 临时页面
    help: './entry/help.tsx', // 帮助页面
    dashboard_v1: './entry/dashboard_v1.tsx', // 16年版控制面板
    // about: './entry/about.tsx', // 关于页面
    edit_data: './entry/edit_data.tsx', // 修改数据
    project: './entry/project.tsx',
    // project_analytics: './entry/project_analytics.tsx', //项目课题统计页面
    // download_client: './entry/download_client.tsx', //客户端下载页面
    // update: './entry/update.tsx', // 更新日志
    // certificate: './entry/certificate.tsx',  //汇交证明页
    // create_template_splicing: './entry/CreateTemplateSplicing.tsx', // 创建模板拼接任务页面
    // data_splicing: './entry/DataSplicing.tsx', // 数据拼接页面
    //  search_20:'./entry/search_20.tsx', // 为20项目制作的搜索页面
    // export_20: './entry/export_20.tsx', //为20项目制作的数据导出页面
    // submit_feedback:'./entry/submitFeedback.tsx', //提交反馈页面
    // feedback_detail:'./entry/viewFeedback.tsx', // 查看反馈页面 回复
    // new_index:'./entry/new_index.tsx',  // 新的首页
    // expr_search_result:'./entry/exprSearchResult.tsx', //高级搜索结果页面
    // udt:"./entry/upload_data_test.tsx",

    federated:'./entry/federated_computing.tsx',
    upload_dataset:'./entry/upload_dataset.tsx',
  };
  // 给每个入口点加入polyfill
  const polyfills = ['whatwg-fetch', 'core-js/stable', 'regenerator-runtime/runtime'];
  for (const i in entry) {
    if (entry.hasOwnProperty(i)) { entry[i] = [...polyfills, entry[i]]; }
  }
  return entry;
}

// loaders
const cssLoaders = [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [require('autoprefixer')]
    }
  }
];

const jsLoaders = [
  {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    }
  }
];

function CreatePages(pages, devMode) {
  return pages.map((value) => {
    return new HtmlWebpackPlugin({
      chunks: [value, 'vendors'],
      title: 'MGED',
      template: devMode ? './html/template.html' : './html/template_django.html',

      // TODO[svtter]: need fix
      filename: devMode ? `${value}.html` : `./dist/templates/${value}.html`,
      minify: devMode,
      //favicon: devMode ? '/static/favicon.ico' : '/static/mgedata/favicon.ico'
    })
  });
}

module.exports = (env, argv) => {
  const isLocal = (env && env.local);
  const isDevServer = (env && env.devServer);
  const enableBundleAnalyze = (env && env.analyze);
  const devMode = (argv.mode === 'development');
  // const publicPath = (devMode || isLocal ? '/dist/static/webpack/' : '/dist/static/webpack/mgedata');
  const publicPath = '/dist/static/webpack/'
  const mgeProjectRoot = path.resolve(__dirname, './dist');

  const siteMap = {
    // analytics: '/analytics',
    // login: '/account/login/',
    login: '/account/login_mge/',
    signup: '/account/register/',
    upload_history: '/account/uploads/', // 新版上传历史界面
    create_template: '/storage/template/new',
    edit_template: '/storage/edit_template',
    check_template: '/storage/check_template',
    edit_snippet:'/storage/edit_snippet',//编辑模板片段
    check_snippet:'/storage/check_snippet',//查看模板片段
    search: '/search',
    upload_data: '/storage/data/new',
    help: '/help',
    dashboard_v1: '/dashboard/',
    about: '/about/',
    project: '/project/',
    // certificate: '/certificate',  //汇交证明页面
    // download_client: '/download_client',  //客户端下载页面

    // index: '/', // 首页
    // export_data: devMode ? './entry/export_data_v2.tsx' : './entry/export_data.tsx', // 数据导出页
    export_data: '/export',
    // task: '/task', // 任务页
    // search: devMode ? './entry/search_v2.tsx' : './entry/search_20.tsx', // 搜索页
    // expr_search: '/expr_search', // 高级搜索页
    show_data: '/show_data',// 数据展示页
    temp: '/temp', // 临时页面
    edit_data: '/storage/edit_data', // 修改数据
    // project_analytics: '/project_analytics', //项目课题统计页面
    // certificate: '/certificate',  //汇交证明页面
    // update: '/update', // 更新日志页面
    // data_splicing: '/data_splicing', // 数据拼接界面
    // search_20:'/search_20', // 为20项目制作的搜索页面
    // export_20: '/export_data20', //为20项目制作的数据导出页面
    // create_template_splicing: '/template_splicing/create', //创建模板拼接任务页面
    // submit_feedback:'/submit_feedback', //提交反馈页面
    // feedback_detail:'/feedback_detail', //反馈详情页面
    // feedback_list:'/feedback_list',//反馈单列表页


    // new_index:'/new_index', // 新的首页
    // expr_search_result: '/expr_result',
    // udt:'/udt_test',

    federated:'/federated',
    upload_dataset:'/dataset_upload'
  };



  const plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    ...CreatePages(Object.keys(siteMap), devMode),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
    // 忽略moment的资源
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ];
  if (enableBundleAnalyze) {
    plugins.unshift(new BundleAnalyzerPlugin())
  }

  if (!isDevServer) {
    plugins.push(
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          path.join(process.cwd(), './dist/static/webpack/*.*'),
          path.join(process.cwd(), './dist/static/webpack/img/*.*'),
          path.join(process.cwd(), './dist/templates/webpack/**/*'),
        ],
        dangerouslyAllowCleanPatternsOutsideProject: true,
        dry: false,
      }),
    );
  }

  function applySiteMap(app) {
    for (const key in siteMap) {
      if (siteMap.hasOwnProperty(key)) {
        app.get(siteMap[key], (req, res, next) => {
          request.get(`http://localhost:18080/dist/static/webpack/${key}.html`, (err, response, body) => {
            if (!err) {
              res.send(body);
            }
          });
        });
      }
    }
  }

  const config = {
    devtool: (devMode ? 'source-map' : undefined),
    optimization: {
      minimizer: [
        // new UglifyJsPlugin({
        //   parallel: true,
        //   uglifyOptions: {
        //     output: { comments: false },
        //   },
        // }),
        new OptimizeCSSAssetsPlugin(),
      ],
      splitChunks: {
        cacheGroups: {
          vendors: {
            //test: /node_modules[\\/](?!(chart|moment)).*/,
            name: "vendors",
            chunks: 'initial',
            minChunks: 4,
          },
        }
      }
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, use: jsLoaders,
          exclude: /(node_modules|venv)/
        },
        {
          test: /\.(ts|tsx)$/, 
          use: [...jsLoaders, 
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: devMode ? 'tsconfig.json' : 'tsconfig.prod.json',
              }
            }
          ],
          exclude: /(node_modules|venv)/
        },
        {
          test: /\.(eot|woff|woff2|ttf)$/,
          loader: 'file-loader',
          options: {
            name: 'font/[name].[ext]'
          }
        },
        {
          test: /\.(svg|png|jpg|gif)$/,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        },
        {
          test: /\.(scss|sass)$/,
          use: [...cssLoaders, 'sass-loader']
        },
        {
          test: /\.less$/,
          use: [
            ...cssLoaders,
            {
              loader: 'less-loader',
              options: {
                modifyVars: {
                  'layout-header-height': '68px',
                  'font-size-base': '16px',
                  'layout-header-padding' : '0 82px;',
                  'layout-header-background': '#0A2D47',
                },
                javascriptEnabled: true,
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: cssLoaders
        }
      ]
    },
    entry: GetEntry(devMode),
    output: {
      path: path.resolve(__dirname, './dist/static/webpack'),
      publicPath: publicPath,
      filename: '[name].js'
    },
    node:{
      fs:'empty'
    },
    stats: {
      errorDetails: true,
      children: false,
      modules: false,
    },
    performance: {
      maxAssetSize: 409600,
      maxEntrypointSize: 512000,
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
      alias: {
        '@ant-design/icons': 'purched-antd-icons',
        'chart.js': 'chart.js/dist/Chart.min.js',
      }
    },
    externals: {
      'jquery': 'window.jQuery',
      'django': 'window.django',
    },
    watchOptions: {
      poll: true,
      ignored: /node_modules/
    },
    devServer: {
      disableHostCheck: true,
      proxy: [
        {
          '/api/v1/storage/file/': "http://localhost:18080/api/v1/storage/file/"
        },
        {
          context: ['/api', '/jsi18n', '/get-urls'],
          // target: 'http://mged.nmdms.ustb.edu.cn',
          // target: 'http://118.178.121.89:8000',
          target: 'http://223.223.185.189:3003',
          // target: 'http://223.223.185.189:4007',
          bypass: function(req, res, proxyOptions) {
            req.path = ''
          }
        },
      ],
      port: 18080,
      before:(app) => {
        applySiteMap(app);
        app.get('./dist/static/webpack/dll/dll.js', (req, res, next) => {
          res.sendFile(path.join(__dirname, './dist/static/webpack/dll/dll.js'));
        });
      }
    }
  }
  return config;
};
