// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({}, {
  rules: {
    'unused-imports/no-unused-vars': 'off',
    'no-alert': 'off',
    'no-console': 'off',
  },
})
