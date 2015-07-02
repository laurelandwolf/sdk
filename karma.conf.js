module.exports = function(config) {

  var browsers = (process.argv.indexOf('-b') > -1)
    ? ['Chrome', 'Firefox', 'Safari']
    : ['PhantomJS'];

  config.set({
    frameworks: ['mocha', 'browserify'],
    reporters: ['dots'],
    browsers: browsers,
    basePath: './',
    files: [
      'test/**/*.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    autoWatch: false,
    singleRun: true,
    client: {
      mocha: {
        ui: 'bdd'
      }
    }
  });
};
