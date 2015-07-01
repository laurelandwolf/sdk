module.exports = function(config) {

  config.set({
    frameworks: ['mocha', 'browserify'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
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
