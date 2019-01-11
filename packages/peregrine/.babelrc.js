// https://twitter.com/jamiebuilds/status/1022568923726639104
const browsers = [
    "> 0.05%",
    "not dead",
    // "not ie 11",
    "not android 4.1",
    "not android 4.2",
    "not android 4.4",
    "not android 4.43",
    "not chrome 29",
    "not chrome 43",
    "not chrome 49",
    "not chrome 54",
    "not chrome 4.1",
    "not firefox 47",
    "not firefox 48",
    "not firefox 51",
    "not firefox 52",
    "not ios 8.1",
    "not ios 9.3",
    "not safari 5.1",
    "not safari 9.1",
]

const plugins = [
    ["syntax-dynamic-import"],
    ["transform-class-properties"],
    ["transform-object-rest-spread"],
    ["transform-react-jsx"],
    
]

const targets = {
    dev: "last 2 Chrome versions",
    prod: browsers,
    test: "node 10",
}

const config = {
    env: {
        development: {
            plugins,
            presets: [["@babel/preset-env", { modules: false, targets: targets.dev }]]
        },
        production: {
            plugins: [
                ...plugins,
                ["transform-runtime", { helpers: true, regenerator: false, useESModules: true }],
            ],
            presets: [["@babel/preset-env", { modules: false, targets: targets.prod }]]
        },
        test: {
            plugins,
            presets: [["@babel/preset-env", { modules: "commonjs", targets: targets.test }]]
        }
    }
}
  
module.exports = config
