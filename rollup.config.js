import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
const fs = require('fs')
const path = require('path')

function genConfig(size, include_svelte_lib, minify) {
	let inp = `index-${size}.js`
	
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
			file: `public/build/bundle-${size}-${include_svelte_lib ? '-lib' : '-nolib'}${minify ? '-min' : '-nomin'}.js`
		},
		external: (id, parent, isResolved) => {
			if (id == 'svelte') return !include_svelte_lib;
			if (id.startsWith('svelte/')) return !include_svelte_lib;
			if (id.includes('svelte/internal')) return !include_svelte_lib;
			if (!id.startsWith('.')) return true;

			let abs = path.resolve(path.dirname(parent), id)

	   		return components.indexOf(abs) < 0;
		},
		plugins: [
			svelte({
				// enable run-time checks when not in production
				dev: false,
				// we'll extract any component CSS out into
				// a separate file - better for performance
				css: css => {
					css.write(`public/build/bundle-${size}.css`);
				}
			}),
	
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			minify && terser()
		]
		
	};
}

let configs = []
let sizes = [1,5,10,20,30,40,50,60,70]
sizes.forEach(size => {
	configs = configs.concat([
		genConfig(size, false, false),
		genConfig(size, false, true),
		genConfig(size, true, false),
		genConfig(size, true, true)
	]);
});


export default configs
