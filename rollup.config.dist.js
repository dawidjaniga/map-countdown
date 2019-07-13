import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json'

export default {
  input: 'src/map-countdown.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'umd',
      name: 'MapCountdown'
    }
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [resolve(), typescript(), postcss()]
}
