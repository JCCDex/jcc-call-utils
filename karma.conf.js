module.exports = function (config) {
    config.set({
        frameworks: ['browserify', 'detectBrowsers', 'mocha'],
        files: [
            'test/*.spec.js'
        ],
        preprocessors: {
            'test/*.spec.js': ['browserify', 'env']
        },
        singleRun: true,
        plugins: [
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-env-preprocessor',
            'karma-firefox-launcher',
            'karma-detect-browsers',
            'karma-mocha'
        ],
        envPreprocessor: [
            'RANDOM_TESTS_REPEAT'
        ],
        detectBrowsers: {
            enabled: true,
            usePhantomJS: false,
            postDetection: function (availableBrowser) {
                if (availableBrowser.includes('Chrome')) {
                    return ['ChromeHeadless']
                }

                var browsers = ['Chrome', 'Firefox']
                return browsers.filter(function (browser) {
                    return availableBrowser.indexOf(browser) !== -1
                })
            }
        }
    })
}