const fg = require('fast-glob')
const fs = require('fs')
const sizes = [1,5,10,20,30,40,50,60,70]
const dirs = ['../svelte/site/src', '../realworld', '../svelte-hn']

let entries = fg.sync(dirs.map(dir => dir+'/**/*.svelte'))

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function fileAsComponentName(fname) {
    return fname.replace('.svelte','').replace(/[\[\]\/\.\-@]/g, '_')
}

let out = []
shuffleArray(entries);

for (let entry of entries) {
    out.push(`export { default as ${fileAsComponentName(entry)} } from '${entry}'`)
}

for (let count of sizes) {
    if (count > out.length) break;
    fs.writeFileSync(`index-${count}.js`, out.slice(0,count).join('\n'))
}


