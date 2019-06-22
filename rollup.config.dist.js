import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json'

export default {
  input: 'src/map-countdown.js',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'umd',
      name: 'MapCountdown'
    }
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      presets: [['@babel/env', { modules: false }]],
      exclude: 'node_modules/**'
    }),
    postcss()
  ]
}
