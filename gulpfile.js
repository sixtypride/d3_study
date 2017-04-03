
var gulp = require('gulp');
var webpack = require('webpack');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var del = require('del');
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");

var indexPage = "html/build.html";
var deployFileName = "deploy.min.js";

var BuildWebpackConfig = {
    watch: true,
    devtool: "source-map",
    module: {
        loaders: [
            {test: /.html$/, loader: 'raw'}, // raw-loader 필요
            {test: /.css$/, loader: 'raw'},
            {
                test: /.js$/, loader: 'babel',   // babel-loader 필요
                exclude: /node_modules/,
                query: {
                    presets: [['es2015', {'loose':true}]],
                    plugins: ["transform-es3-property-literals", "transform-es3-member-expression-literals"]
                }
            }
        ]
    }
};

function setBuildConfig(entry, output, indexHtml) {
    BuildWebpackConfig.entry = entry;
    BuildWebpackConfig.output = output;
    BuildWebpackConfig.plugins = [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: {baseDir: ['./'], index: indexHtml}
        })
    ];
}



gulp.task('build_clean', function () {
    return del(['./build/Main.js', './build/Main.js.map']);
});

gulp.task('deploy_clean', function () {
    return del(['deploy/' + deployFileName]);
});

gulp.task('build', ['build_clean'], function () {
    setBuildConfig(
        {'Main': './src/Main.js'},
        {path: './build/', filename: 'Main.js'}, indexPage);
    webpack(BuildWebpackConfig, function () {
    });
});

gulp.task('deploy', ['deploy_clean'], function () {
    gulp.src(['./lib/polyfill.js', './src/Namespace.js', './build/Main.js'])
        .pipe(concat(deployFileName))
        .pipe(uglify())
        .pipe(gulp.dest('./deploy/'));
});