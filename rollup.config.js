import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

import pkg from './package.json'

export default {
  input: 'src/map-countdown.js',
  output: [
    {
      file: 'examples/bundle.js',
      format: 'iife',
      name: 'MapCountdown'
    }
  ],
  sourcemap: true,
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      presets: [['@babel/env', { modules: false }]],
      exclude: 'node_modules/**'
    }),
    livereload('examples'),
    serve({
      open: true,
      contentBase: './examples/'
    })
  ]
}
