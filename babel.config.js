module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        node: 'current',
      },
    }],
  ],
  plugins: [
    'add-module-exports',
  ],
}
