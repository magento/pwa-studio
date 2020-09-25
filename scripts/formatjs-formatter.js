// Format extracted translation strings to Magento standard
// Run extract command from project root
// yarn extract "packages/venia-ui/lib/components/**/*.js*" --out-file packages/venia-ui/i18n/en.json --id-interpolation-pattern '[sha512:contenthash:base64:6]' --format scripts/formatjs-formatter.js
exports.format = function(msgs) {
    const results = {};
    for (const [id, msg] of Object.entries(msgs)) {
        results[id] = msg.defaultMessage;
    }
    return results;
};
