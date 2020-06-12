module.exports = {
    "env": {
        "browser": true,
        "es2020": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "rules": {
        "no-console": "off",
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        semi: ["error", "always"],
    }
};
