import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
const fs = require('fs')
const path = require('path')

function genReactConfig(size, minify) {
	let inp = `index-${size}-react.js`
	
	//ensure only the components specified are included.
	var content = fs.readFileSync(inp, 'utf-8');
	let components = []
	content.replace(/from '(.*?)'/gmi, (match, fname) => {
		components.push(path.resolve(__dirname, fname));
		return ''
	})
	
	return {
		input: inp,
		output: {
			format: 'esm',
			name: 'app',
			file: `public/build/bundle-react-${size}-${minify ? '-min' : '-nomin'}.js`
		},
		external: (id, parent, isResolved) => {
			if (!id.startsWith('.')) return true;
			if (id.includes('@babel/runtime')) return true;
			let abs = path.resolve(path.dirname(parent), id)
	   		return components.indexOf(abs) < 0;
		},
		plugins: [
			babel({
				babelHelpers: "runtime",
				plugins: 
					["@babel/plugin-transform-runtime", "@babel/plugin-transform-react-jsx", "@babel/plugin-syntax-class-properties"]
				
			}),
			
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true
			}),
			commonjs(),
			minify && terser()
		]
		
	};
}


let configs = []

let reactSizes = [1,5,10,20,30,40,50]
reactSizes.forEach(size => {
	configs = configs.concat([
		genReactConfig(size, false),
		genReactConfig(size, true),
	]);
});


export default configs
