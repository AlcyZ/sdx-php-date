import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    overrides: {
      'vue/block-order': ['error', {
        order: [['template', 'script'], 'style'],
      }],
    },
  },
})
