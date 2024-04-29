const { configs } = require('@eslint/js');

module.exports = [
  {
    ignores: ["coverage/", "dist/", ".idea/"]
  },
  configs.recommended,
  {
    rules: {
      "no-underscore-dangle": "warn",
      "no-undef": "off",
    },
  }
];
