var fs = require('fs');

//readFileSync

console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');

console.log('a');
var result = fs.readFile('syntax/sample.txt', 'utf8', (err, data)=> {
    console.log(data, 'b');
});
console.log('c');

