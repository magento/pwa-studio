const { declareColors } = require('../lib/colors');

const addRulesets = ({ addBase }) => {
    addBase({
        ':root': declareColors()
    });
};

const ID = 'root';
module.exports = [ID, addRulesets];
