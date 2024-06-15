import eslint from '@eslint/js';

export default [
  {
    ignores: ["coverage/", "dist/", ".idea/"]
  },
  eslint.configs.recommended,
  {
    rules: {
      "no-underscore-dangle": "warn",
      "no-undef": "off",
    },
  }
];
