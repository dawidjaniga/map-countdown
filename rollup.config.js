import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import pkg from './package.json'

export default {
  input: 'src/map-countdown.js',
  output: [
    {
      file: 'examples/bundle.js',
      format: 'umd',
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
    postcss(),
    livereload('examples'),
    serve({
      open: true,
      contentBase: './examples/'
    })
  ]
}
