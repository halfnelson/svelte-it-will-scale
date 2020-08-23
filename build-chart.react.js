
const childProcess = require('child_process')
const fs = require('fs')

const component_counts = [1,5,10,20,30,40,50]

// build the bundles
console.log("building bundles....");

childProcess.execSync('npx rollup -c rollup.config.react.js');

console.log("performing gzips...")
// build the gzips
component_counts.forEach(c => 
    childProcess.execSync(`tar -czvf public/build/bundle-react-${c}--lib-min.tar.gz public/build/bundle-react-${c}--min.js node_modules/react/umd/react.production.min.js node_modules/react-dom/umd/react-dom.production.min.js`)
);


function getTotalScriptSize(index) {
    let size = 0;
    content = fs.readFileSync(index, "utf-8")
    content.replace(/from '(.*?)'/gmi, (match, fname) => {
        size = size + fileSize(fname)
        return match;
    })
    return size;
}

// print the stats
function fileSize(fname) {
    return fs.statSync(fname).size
}

console.log('count original lib-nomin nolib-nomin lib-min nolib-min lib-min-gz')

react_lib_size = fileSize('node_modules/react/umd/react.production.min.js') + fileSize('node_modules/react-dom/umd/react-dom.production.min.js')

component_counts.forEach(c => {
    const bp = `public/build/bundle-react-${c}-`
    console.log([c,
         getTotalScriptSize(`index-${c}-react.js`),
         fileSize(`${bp}-nomin.js`) + react_lib_size,
         fileSize(`${bp}-nomin.js`),
         fileSize(`${bp}-min.js`) + react_lib_size,
         fileSize(`${bp}-min.js`),
         fileSize(`${bp}-lib-min.tar.gz`)
        ].join(' '));
})








