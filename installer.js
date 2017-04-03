var child_process = require( 'child_process' );
var fs = require( 'fs' );

var packageJson = "\n{\n  \"name\": \"template\",\n  \"version\": \"1.0.0\",\n  \"description\": \"project template\",\n  \"main\": \"index.js\",\n  \"scripts\": {},\n  \"author\": \"\",\n  \"license\": \"ISC\",\n  \"devDependencies\": {\n    \"babel-core\": \"^6.17.0\",\n    \"babel-loader\": \"^6.2.4\",\n    \"babel-plugin-transform-es3-member-expression-literals\": \"^6.8.0\",\n    \"babel-plugin-transform-es3-property-literals\": \"^6.8.0\",\n    \"babel-preset-es2015\": \"^6.16.0\",\n    \"babel-preset-es2015-ie\": \"^6.6.2\",\n    \"browser-sync\": \"^2.14.0\",\n    \"browser-sync-webpack-plugin\": \"^1.1.2\",\n    \"del\": \"^2.2.1\",\n    \"event-emitter-es6\": \"^1.1.5\",\n    \"gulp\": \"^3.9.1\",\n    \"gulp-concat\": \"^2.6.0\",\n    \"gulp-rename\": \"^1.2.2\",\n    \"gulp-uglify\": \"^1.5.4\",\n    \"jquery\": \"^1.11.3\",\n    \"lodash\": \"^4.15.0\",\n    \"raw-loader\": \"^0.5.1\",\n    \"through2\": \"^2.0.1\",\n    \"webpack\": \"^1.13.1\"\n  }\n}";
var gitignore = "\n# Created by https://www.gitignore.io/api/node\n\n### Node ###\n# Logs\nlogs\n*.log\nnpm-debug.log*\n\n# Runtime data\npids\n*.pid\n*.seed\n*.pid.lock\n\n# Directory for instrumented libs generated by jscoverage/JSCover\nlib-cov\n\n# Coverage directory used by tools like istanbul\ncoverage\n\n# nyc test coverage\n.nyc_output\n\n# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)\n.grunt\n\n# node-waf configuration\n.lock-wscript\n\n# Compiled binary addons (http://nodejs.org/api/addons.html)\nbuild/Release\n\n# Dependency directories\nnode_modules\njspm_packages\n\n# Optional npm cache directory\n.npm\n\n# Webstorm configuration\n.idea\n\n# Optional REPL history\n.node_repl_history";
var gulpfile_js = "\nvar gulp = require('gulp');\nvar webpack = require('webpack');\nvar uglify = require('gulp-uglify');\nvar concat = require('gulp-concat');\nvar rename = require('gulp-rename');\nvar del = require('del');\nvar BrowserSyncPlugin = require(\"browser-sync-webpack-plugin\");\n\nvar indexPage = \"html/build.html\";\nvar deployFileName = \"deploy.min.js\";\n\nvar BuildWebpackConfig = {\n    watch: true,\n    devtool: \"source-map\",\n    module: {\n        loaders: [\n            {test: /.html$/, loader: 'raw'}, // raw-loader \uD544\uC694\n            {test: /.css$/, loader: 'raw'},\n            {\n                test: /.js$/, loader: 'babel',   // babel-loader \uD544\uC694\n                exclude: /node_modules/,\n                query: {\n                    presets: [['es2015', {'loose':true}]],\n                    plugins: [\"transform-es3-property-literals\", \"transform-es3-member-expression-literals\"]\n                }\n            }\n        ]\n    }\n};\n\nfunction setBuildConfig(entry, output, indexHtml) {\n    BuildWebpackConfig.entry = entry;\n    BuildWebpackConfig.output = output;\n    BuildWebpackConfig.plugins = [\n        new BrowserSyncPlugin({\n            host: 'localhost',\n            port: 3000,\n            server: {baseDir: ['./'], index: indexHtml}\n        })\n    ];\n}\n\n\n\ngulp.task('build_clean', function () {\n    return del(['./build/Main.js', './build/Main.js.map']);\n});\n\ngulp.task('deploy_clean', function () {\n    return del(['deploy/' + deployFileName]);\n});\n\ngulp.task('build', ['build_clean'], function () {\n    setBuildConfig(\n        {'Main': './src/Main.js'},\n        {path: './build/', filename: 'Main.js'}, indexPage);\n    webpack(BuildWebpackConfig, function () {\n    });\n});\n\ngulp.task('deploy', ['deploy_clean'], function () {\n    gulp.src(['./lib/polyfill.js', './src/Namespace.js', './build/Main.js'])\n        .pipe(concat(deployFileName))\n        .pipe(uglify())\n        .pipe(gulp.dest('./deploy/'));\n});";
var main_js = "\nclass Main {\n    constructor() {\n        // (\uCC38\uACE0) \uD074\uB798\uC2A4 \uB0B4\uC5D0 \uC77C\uBC18 \uD568\uC218\uAC00 \uC5C6\uC744\uACBD\uC6B0 IE8\uC5D0\uC11C uglify\uB97C \uD558\uBA74 \uC5D0\uB7EC\uAC00 \uBC1C\uC0DD\uD55C\uB2E4.\n        this.init();\n    }\n    init() {\n        alert(\"Hello\");\n    }\n}\nexport default Main;\nwindow.nts.ria.Main = Main;";
var namespace_js = "\nwindow.nts = window.nts || {};\nwindow.nts.ria = window.nts.ria || {};";
var polyfill_js = "\n// polyfill for ES3\nif (typeof window.Element == 'undefined') {\n    window.Element = function(){\n    };\n}\n//----------------------------------------------------------------------\n//\n// ECMAScript 5 Polyfills\n//\n//----------------------------------------------------------------------\n\n//----------------------------------------------------------------------\n// ES5 15.2 Object Objects\n//----------------------------------------------------------------------\n\n//\n// ES5 15.2.3 Properties of the Object Constructor\n//\n\n// ES5 15.2.3.2 Object.getPrototypeOf ( O )\n// From http://ejohn.org/blog/objectgetprototypeof/\n// NOTE: won't work for typical function T() {}; T.prototype = {}; new T; case\n// since the constructor property is destroyed.\nif (!Object.getPrototypeOf) {\n    Object.getPrototypeOf = function (o) {\n        if (o !== Object(o)) { throw TypeError(\"Object.getPrototypeOf called on non-object\"); }\n        return o.__proto__ || o.constructor.prototype || Object.prototype;\n    };\n}\n\n//    // ES5 15.2.3.3 Object.getOwnPropertyDescriptor ( O, P )\n//    if (typeof Object.getOwnPropertyDescriptor !== \"function\") {\n//        Object.getOwnPropertyDescriptor = function (o, name) {\n//            if (o !== Object(o)) { throw TypeError(); }\n//            if (o.hasOwnProperty(name)) {\n//                return {\n//                    value: o[name],\n//                    enumerable: true,\n//                    writable: true,\n//                    configurable: true\n//                };\n//            }\n//        };\n//    }\n\n// ES5 15.2.3.4 Object.getOwnPropertyNames ( O )\nif (typeof Object.getOwnPropertyNames !== \"function\") {\n    Object.getOwnPropertyNames = function (o) {\n        if (o !== Object(o)) { throw TypeError(\"Object.getOwnPropertyNames called on non-object\"); }\n        var props = [], p;\n        for (p in o) {\n            if (Object.prototype.hasOwnProperty.call(o, p)) {\n                props.push(p);\n            }\n        }\n        return props;\n    };\n}\n\n// ES5 15.2.3.5 Object.create ( O [, Properties] )\nif (typeof Object.create !== \"function\") {\n    Object.create = function (prototype, properties) {\n        if (typeof prototype !== \"object\") { throw TypeError(); }\n        function Ctor() {}\n        Ctor.prototype = prototype;\n        var o = new Ctor();\n        if (prototype) { o.constructor = Ctor; }\n        if (properties !== undefined) {\n            if (properties !== Object(properties)) { throw TypeError(); }\n            Object.defineProperties(o, properties);\n        }\n        return o;\n    };\n}\n\n// ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )\n// Partial support for most common case - getters, setters, and values\n(function() {\n    if (!Object.defineProperty ||\n        !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } } ())) {\n        var orig = Object.defineProperty;\n        Object.defineProperty = function (o, prop, desc) {\n            // In IE8 try built-in implementation for defining properties on DOM prototypes.\n            if (orig) { try { return orig(o, prop, desc); } catch (e) {} }\n\n            if (o !== Object(o)) { throw TypeError(\"Object.defineProperty called on non-object\"); }\n            if (Object.prototype.__defineGetter__ && ('get' in desc)) {\n                Object.prototype.__defineGetter__.call(o, prop, desc.get);\n            }\n            if (Object.prototype.__defineSetter__ && ('set' in desc)) {\n                Object.prototype.__defineSetter__.call(o, prop, desc.set);\n            }\n            if ('value' in desc) {\n                o[prop] = desc.value;\n            }\n            return o;\n        };\n    }\n}());\n\n// ES 15.2.3.7 Object.defineProperties ( O, Properties )\nif (typeof Object.defineProperties !== \"function\") {\n    Object.defineProperties = function (o, properties) {\n        if (o !== Object(o)) { throw TypeError(\"Object.defineProperties called on non-object\"); }\n        var name;\n        for (name in properties) {\n            if (Object.prototype.hasOwnProperty.call(properties, name)) {\n                Object.defineProperty(o, name, properties[name]);\n            }\n        }\n        return o;\n    };\n}\n\n\n// ES5 15.2.3.14 Object.keys ( O )\n// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys\nif (!Object.keys) {\n    Object.keys = function (o) {\n        if (o !== Object(o)) { throw TypeError('Object.keys called on non-object'); }\n        var ret = [], p;\n        for (p in o) {\n            if (Object.prototype.hasOwnProperty.call(o, p)) {\n                ret.push(p);\n            }\n        }\n        return ret;\n    };\n}\n\n//----------------------------------------------------------------------\n// ES5 15.3 Function Objects\n//----------------------------------------------------------------------\n\n//\n// ES5 15.3.4 Properties of the Function Prototype Object\n//\n\n// ES5 15.3.4.5 Function.prototype.bind ( thisArg [, arg1 [, arg2, ... ]] )\n// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind\nif (!Function.prototype.bind) {\n    Function.prototype.bind = function (o) {\n        if (typeof this !== 'function') { throw TypeError(\"Bind must be called on a function\"); }\n        var slice = [].slice,\n            args = slice.call(arguments, 1),\n            self = this,\n            bound = function () {\n                return self.apply(this instanceof nop ? this : o,\n                    args.concat(slice.call(arguments)));\n            };\n\n        function nop() {}\n        nop.prototype = self.prototype;\n        bound.prototype = new nop();\n        return bound;\n    };\n}\n\n\n//----------------------------------------------------------------------\n// ES5 15.4 Array Objects\n//----------------------------------------------------------------------\n\n//\n// ES5 15.4.3 Properties of the Array Constructor\n//\n\n\n// ES5 15.4.3.2 Array.isArray ( arg )\n// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray\nArray.isArray = Array.isArray || function (o) { return Boolean(o && Object.prototype.toString.call(Object(o)) === '[object Array]'); };\n\n\n//\n// ES5 15.4.4 Properties of the Array Prototype Object\n//\n\n// ES5 15.4.4.14 Array.prototype.indexOf ( searchElement [ , fromIndex ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf\nif (!Array.prototype.indexOf) {\n    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (len === 0) { return -1; }\n\n        var n = 0;\n        if (arguments.length > 0) {\n            n = Number(arguments[1]);\n            if (isNaN(n)) {\n                n = 0;\n            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {\n                n = (n > 0 || -1) * Math.floor(Math.abs(n));\n            }\n        }\n\n        if (n >= len) { return -1; }\n\n        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);\n\n        for (; k < len; k++) {\n            if (k in t && t[k] === searchElement) {\n                return k;\n            }\n        }\n        return -1;\n    };\n}\n\n// ES5 15.4.4.15 Array.prototype.lastIndexOf ( searchElement [ , fromIndex ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf\nif (!Array.prototype.lastIndexOf) {\n    Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (len === 0) { return -1; }\n\n        var n = len;\n        if (arguments.length > 1) {\n            n = Number(arguments[1]);\n            if (n !== n) {\n                n = 0;\n            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {\n                n = (n > 0 || -1) * Math.floor(Math.abs(n));\n            }\n        }\n\n        var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);\n\n        for (; k >= 0; k--) {\n            if (k in t && t[k] === searchElement) {\n                return k;\n            }\n        }\n        return -1;\n    };\n}\n\n// ES5 15.4.4.16 Array.prototype.every ( callbackfn [ , thisArg ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every\nif (!Array.prototype.every) {\n    Array.prototype.every = function (fun /*, thisp */) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (typeof fun !== \"function\") { throw TypeError(); }\n\n        var thisp = arguments[1], i;\n        for (i = 0; i < len; i++) {\n            if (i in t && !fun.call(thisp, t[i], i, t)) {\n                return false;\n            }\n        }\n\n        return true;\n    };\n}\n\n// ES5 15.4.4.17 Array.prototype.some ( callbackfn [ , thisArg ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some\nif (!Array.prototype.some) {\n    Array.prototype.some = function (fun /*, thisp */) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (typeof fun !== \"function\") { throw TypeError(); }\n\n        var thisp = arguments[1], i;\n        for (i = 0; i < len; i++) {\n            if (i in t && fun.call(thisp, t[i], i, t)) {\n                return true;\n            }\n        }\n\n        return false;\n    };\n}\n\n// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach\nif (!Array.prototype.forEach) {\n    Array.prototype.forEach = function (fun /*, thisp */) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (typeof fun !== \"function\") { throw TypeError(); }\n\n        var thisp = arguments[1], i;\n        for (i = 0; i < len; i++) {\n            if (i in t) {\n                fun.call(thisp, t[i], i, t);\n            }\n        }\n    };\n}\n\n\n// ES5 15.4.4.19 Array.prototype.map ( callbackfn [ , thisArg ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Map\nif (!Array.prototype.map) {\n    Array.prototype.map = function (fun /*, thisp */) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (typeof fun !== \"function\") { throw TypeError(); }\n\n        var res = []; res.length = len;\n        var thisp = arguments[1], i;\n        for (i = 0; i < len; i++) {\n            if (i in t) {\n                res[i] = fun.call(thisp, t[i], i, t);\n            }\n        }\n\n        return res;\n    };\n}\n\n// ES5 15.4.4.20 Array.prototype.filter ( callbackfn [ , thisArg ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Filter\nif (!Array.prototype.filter) {\n    Array.prototype.filter = function (fun /*, thisp */) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (typeof fun !== \"function\") { throw TypeError(); }\n\n        var res = [];\n        var thisp = arguments[1], i;\n        for (i = 0; i < len; i++) {\n            if (i in t) {\n                var val = t[i]; // in case fun mutates this\n                if (fun.call(thisp, val, i, t)) {\n                    res.push(val);\n                }\n            }\n        }\n\n        return res;\n    };\n}\n\n\n// ES5 15.4.4.21 Array.prototype.reduce ( callbackfn [ , initialValue ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce\nif (!Array.prototype.reduce) {\n    Array.prototype.reduce = function (fun /*, initialValue */) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (typeof fun !== \"function\") { throw TypeError(); }\n\n        // no value to return if no initial value and an empty array\n        if (len === 0 && arguments.length === 1) { throw TypeError(); }\n\n        var k = 0;\n        var accumulator;\n        if (arguments.length >= 2) {\n            accumulator = arguments[1];\n        } else {\n            do {\n                if (k in t) {\n                    accumulator = t[k++];\n                    break;\n                }\n\n                // if array contains no values, no initial value to return\n                if (++k >= len) { throw TypeError(); }\n            }\n            while (true);\n        }\n\n        while (k < len) {\n            if (k in t) {\n                accumulator = fun.call(undefined, accumulator, t[k], k, t);\n            }\n            k++;\n        }\n\n        return accumulator;\n    };\n}\n\n\n// ES5 15.4.4.22 Array.prototype.reduceRight ( callbackfn [, initialValue ] )\n// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight\nif (!Array.prototype.reduceRight) {\n    Array.prototype.reduceRight = function (callbackfn /*, initialValue */) {\n        if (this === void 0 || this === null) { throw TypeError(); }\n\n        var t = Object(this);\n        var len = t.length >>> 0;\n        if (typeof callbackfn !== \"function\") { throw TypeError(); }\n\n        // no value to return if no initial value, empty array\n        if (len === 0 && arguments.length === 1) { throw TypeError(); }\n\n        var k = len - 1;\n        var accumulator;\n        if (arguments.length >= 2) {\n            accumulator = arguments[1];\n        } else {\n            do {\n                if (k in this) {\n                    accumulator = this[k--];\n                    break;\n                }\n\n                // if array contains no values, no initial value to return\n                if (--k < 0) { throw TypeError(); }\n            }\n            while (true);\n        }\n\n        while (k >= 0) {\n            if (k in t) {\n                accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);\n            }\n            k--;\n        }\n\n        return accumulator;\n    };\n}\n\n\n//----------------------------------------------------------------------\n// ES5 15.5 String Objects\n//----------------------------------------------------------------------\n\n//\n// ES5 15.5.4 Properties of the String Prototype Object\n//\n\n\n// ES5 15.5.4.20 String.prototype.trim()\nif (!String.prototype.trim) {\n    String.prototype.trim = function () {\n        return String(this).replace(/^s+/, '').replace(/s+$/, '');\n    };\n}\n\n\n\n//----------------------------------------------------------------------\n// ES5 15.9 Date Objects\n//----------------------------------------------------------------------\n\n\n//\n// ES 15.9.4 Properties of the Date Constructor\n//\n\n// ES5 15.9.4.4 Date.now ( )\n// From https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Date/now\nif (!Date.now) {\n    Date.now = function now() {\n        return Number(new Date());\n    };\n}\n\n\n//\n// ES5 15.9.5 Properties of the Date Prototype Object\n//\n\n// ES5 15.9.4.43 Date.prototype.toISOString ( )\n// Inspired by http://www.json.org/json2.js\nif (!Date.prototype.toISOString) {\n    Date.prototype.toISOString = function () {\n        function pad2(n) { return ('00' + n).slice(-2); }\n        function pad3(n) { return ('000' + n).slice(-3); }\n\n        return this.getUTCFullYear() + '-' +\n            pad2(this.getUTCMonth() + 1) + '-' +\n            pad2(this.getUTCDate()) + 'T' +\n            pad2(this.getUTCHours()) + ':' +\n            pad2(this.getUTCMinutes()) + ':' +\n            pad2(this.getUTCSeconds()) + '.' +\n            pad3(this.getUTCMilliseconds()) + 'Z';\n    };\n}";
var deploy_html = "\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Title</title>\n</head>\n<body>\n<script src=\"./../deploy/deploy.min.js\"></script>\n<script>\n\n</script>\n</body>\n</html>";
var build_html = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Title</title>\n</head>\n<body>\n<script src=\"./../src/Namespace.js\"></script>\n<script src=\"./../build/Main.js\"></script>\n<script>\n    var main = new nts.ria.Main();\n</script>\n</body>\n</html>\n";

// 폴더 만들기
fs.mkdirSync('./build');
fs.mkdirSync('./deploy');
fs.mkdirSync('./html');
fs.mkdirSync('./src');
fs.mkdirSync('./lib');

// 파일 만들기
fs.writeFileSync('package.json', packageJson);
fs.writeFileSync('.gitignore', gitignore);
fs.writeFileSync('gulpfile.js', gulpfile_js);
fs.writeFileSync('./src/Main.js', main_js);
fs.writeFileSync('./src/Namespace.js', namespace_js);
fs.writeFileSync('./lib/polyfill.js', polyfill_js);
fs.writeFileSync('./html/deploy.html', deploy_html);
fs.writeFileSync('./html/build.html', build_html);

// npm install 실행
child_process.exec('npm install');




