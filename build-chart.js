
const childProcess = require('child_process')
const fs = require('fs')

const component_counts = [1,5,10,20,30,40,50,60,70]

// build the bundles
console.log("building bundles....");

childProcess.execSync('npx rollup -c');

console.log("performing gzips...")
// build the gzips
component_counts.forEach(c => 
    childProcess.execSync(`gzip -c public/build/bundle-${c}--lib-min.js > public/build/bundle-${c}--lib-min.js.gz`)
);

function getTotalScriptSize(index) {
    const content = fs.readFileSync(index, 'utf-8');

    let size = 0;

    content.replace(/from '(.*?)'/gmi, (match, fname) => {
        const content = fs.readFileSync(fname, 'utf-8');
        let non_style_content = content.replace(/<style>.*?<\/style>/mgis, sub => {
            return '';
        })
        size = size + non_style_content.length;
        return match;
    })
    return size;
}

// print the stats
function fileSize(fname) {
    return fs.statSync(fname).size
}

console.log('count original lib-nomin nolib-nomin lib-min nolib-min lib-min-gz')

component_counts.forEach(c => {
    const bp = `public/build/bundle-${c}-`
    console.log([c,
         getTotalScriptSize(`index-${c}.js`),
         fileSize(`${bp}-lib-nomin.js`),
         fileSize(`${bp}-nolib-nomin.js`),
         fileSize(`${bp}-lib-min.js`),
         fileSize(`${bp}-nolib-min.js`), 
         fileSize(`${bp}-lib-min.js.gz`)
        ].join(' '));
})








