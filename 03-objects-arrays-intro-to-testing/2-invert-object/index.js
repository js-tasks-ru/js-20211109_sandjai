/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

const newObject = {};
if (!obj) return;

    Object.entries(obj).forEach((item,i) => {
    newObject[item[1]] = item[0];    
})

return newObject;
}

const obj = { key: 'value' };