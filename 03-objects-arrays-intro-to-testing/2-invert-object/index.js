/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

const newObject = {};

if ((typeof obj === 'object') && (obj != null)) {

    Object.entries(obj).forEach((item,i) => {

    newObject[item[1]] = item[0];    
})
}
else {
    return undefined;
}

return newObject;
}

const obj = { key: 'value' };

console.log(invertObj(obj)); // { value: 'key'}
