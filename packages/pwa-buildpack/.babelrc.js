const config = {
    plugins: ["@babel/plugin-proposal-class-properties", { spec: true }],
    presets: [["@babel/preset-env", { targets: "node 10" }]]
}

module.exports = config
