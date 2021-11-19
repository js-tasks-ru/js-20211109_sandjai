/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
 const product = {
  category: {
    title: "Goods"
  }
}

export function createGetter(path) {

  const arr = path.split("."); 
  
  return (obj) => {
    arr.forEach((item,i) => { 
   
     if (typeof obj === 'object') {
      obj = obj[arr[i]];
     }
     else obj = undefined;
    })

    return obj;


  }   
}
const getter = createGetter('category.title');
console.log(getter(product)); 