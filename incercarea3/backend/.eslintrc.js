module.exports = {
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:node/recommended"
    ],
    "parserOptions": {
      "ecmaVersion": 2021,
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "env": {
      "browser": true,
      "node": true
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "plugins": ["react", "node"],
    "rules": {
      // Add any specific rules or overrides here
    }
  }
  

