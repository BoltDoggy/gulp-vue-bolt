'use strict';

var path = require('path');

var gutil = require('gulp-util');
var through = require('through2');

var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-vue-bolt';

function gulpVueify(options) {
    return through.obj(function (file, encode, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported'));
            return callback();
        }

        // if file.isBuffer()
        if (!options.compiler) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Bolt need options.compiler'));
            return callback();
        }
        compiler.compile(file.contents.toString(), file.path, function (err, result) {
            if (err) {
                this.emit('error', new PluginError(PLUGIN_NAME,
                    'In file ' + path.relative(process.cwd(), file.path) + ':\n' + err.message));
                return callback();
            }
            file.path = gutil.replaceExtension(file.path, '.js');
            file.contents = new Buffer(result);
            callback(null, file);
        }.bind(this));
    });
}

module.exports = gulpVueify;
