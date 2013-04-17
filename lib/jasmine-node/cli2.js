'use strict'

var cli = require('cli');
var path = require('path');
var fs = require('fs');
var jasmine = require('./index');
var helperCollection = require('./spec-collection');

var OPTIONS = {
    'autotest': ['autotest', 'rerun automatically the specs when a file changes', 'boolean', false],
    'noColor': ['noColor', 'use color coding for output', 'boolean', false],
    'match': ['m', 'REGEXP - load only specs containing "REGEXPspec', 'string', undefined],
    'matchall': ['matchall', 'relax requirement of "spec" in spec file names', 'boolean', false],
    'verbose': ['verbose', 'print extra information per each test run', 'boolean', true],
    'coffee': ['coffee', 'load coffee-script which allows execution .coffee files', 'boolean', false],
    'junitreport': ['junitreport', 'export tests results as junitreport xml format', 'boolean', false],
    'output': ['output', 'defines the output folder for junitreport files', 'string', undefined],
    'teamcity': ['teamcity', 'converts all console output to teamcity custom test runner commands. (Normally auto detected.)', 'string', undefined],
    'runWithRequireJs': ['runWithRequireJs', 'loads all specs using requirejs instead of node\'s native require method', 'boolean', false],
    'requireJsSetup': ['requireJsSetup', 'file run before specs to include and configure RequireJS', 'string', undefined],
    'test-dir': ['test-dir', 'the absolute root directory path where tests are located', 'string', undefined],
    'nohelpers': ['nohelpers', 'does not load helpers', 'boolean', false],
    'forceexit': ['forceexit', 'force exit once tests complete', 'boolean', false],
    'captureExceptions': ['captureExceptions', 'listen to global exceptions, report them and exit (interferes with Domains)', 'boolean', false],
    'noStack': ['noStack', 'suppress the stack trace generated from a test failure', 'boolean', false]
};

var util;

try {
    util = require('util');
} catch (e) {
    util = require('sys');
}

var specFolders = [];

// The following line keeps the jasmine setTimeout in the proper scope
jasmine.setTimeout = jasmine.getGlobal().setTimeout;
jasmine.setInterval = jasmine.getGlobal().setInterval;

for (var key in jasmine) {
    //global[key] = jasmine[key];
}

var junitreport = {
    report: false,
    savePath: './reports/',
    useDotNotation: true,
    consolidate: true
};

function run(options) {
    if(options.extentions === undefined){
        options.extentions = 'js';
    }
    if(options.coffee === true){
        require('coffee-script');
        options.extentions = options.extentions+'|coffee|litcoffee';
    }
    if(options.junitreport === true){
        options.junitreport = junitreport;
        options.junitreport.report = true;
    }
    if(options.output !== undefined){
        options.junitreport.savePath = options.output;
    }

}

function interpret(args) {
    cli.setArgv(args);
    cli.options = {};

    cli.enable('version', 'glob', 'help');
    cli.setApp(path.resolve(__dirname + '/../../package.json'));

    var options = cli.parse(OPTIONS);

    options.teamcity = process.env.TEAMCITY_PROJECT_NAME ? process.env.TEAMCITY_PROJECT_NAME : false;


}
var exports = {
    interpret: interpret,
    run:run
};


module.exports = exports;