import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'game.js',
  output: {
    file: 'dist/game.js',
    format: 'iife',
    name: 'HulegeyouGame'
  },
  plugins: [
    resolve({ browser: true }),
    commonjs()
  ]
};
