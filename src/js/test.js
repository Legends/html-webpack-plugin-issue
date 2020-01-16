const t = function name() {
    return { name: "Mike", age: 12 };
}

exports.x = t; 


// CommonJS

// module.exports = value  <-- just export one value // default export

// or

// exports.uppercase = str => str.toUpperCase()

// or multiple values:
// exports.a = 1
// exports.b = 2
// exports.c = 3


// ES6 exports

// export default function () { ··· } // no semicolon!
// export function hello(){}
// export const sqrt = Math.sqrt; 
