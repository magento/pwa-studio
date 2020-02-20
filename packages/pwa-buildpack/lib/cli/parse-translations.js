const fs = require('fs');
const fetch = require('node-fetch');
const Parser = require('i18next-scanner').Parser;
const { path, resolve } = require('path');
const graphql = require('../Utilities/graphQL');
const loadEnvironment = require('../Utilities/loadEnvironment');
var vfs = require('vinyl-fs');
const parser = new Parser();

module.exports.command = 'parse-translations <directory>';

module.exports.describe =
    'Load and validate the current environment, including .env file if present, to ensure all required configuration is in place.';

module.exports.builder = {
    coreDevMode: {
        type: 'boolean',
        desc:
            'For core @magento/pwa-studio repository development. Creates a .env file populated with examples if one is not present.'
    }
};

module.exports.handler = function buildpackCli(
    { directory, coreDevMode },
    proc = process
) {
    const projectRoot = resolve(directory);

    const projectConfig = loadEnvironment(projectRoot);
    const config = projectConfig.section('MAGENTO_BACKEND');
    
    process.env.MAGENTO_BACKEND_URL = config.url;
    console.log(process.env.MAGENTO_BACKEND_URL);

    async function queryTranslations() {
        const result = await graphql.getTranslations('en_US', ['test','General']);
        console.log(result);
    }

    // Parse Translation Function
    // i18next.t('key');
    /**
    content = fs.readdirSync('./', 'utf-8', '.js')
    .filter(file => file.slice(-3) === '.js')
    .forEach((file) => {
        console.log(file.toString());
        parser.parseFuncFromString(fs.readFileSync(file), { list: ['i18n.t']}) // override `func.list`
        console.log(parser.get());
    });
    */
    //content = fs.readFileSync('./*', 'utf-8');

    const walk = (dir, done) => {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var pending = list.length;

            if (!pending) return done(null, results);

            list.forEach(function(file) {
                file = resolve(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                        });
                    } else {
                        if (file.slice(-3) == '.js') {
                            results.push(file);
                        }
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    };

    console.log(directory);
    walk(directory + '/src', function(err, results) {
        if (err) throw err;
        results.forEach(function(result) {
            parser.parseFuncFromString(fs.readFileSync(result), { list: ['i18n.t']}) // override `func.list`
        });

        console.log(results);
        console.log(parser.get());
    });
};