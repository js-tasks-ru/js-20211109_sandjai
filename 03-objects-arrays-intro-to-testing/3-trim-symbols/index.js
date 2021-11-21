/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string,size) {
    const arr = string.split("");
    let counter=0,
    symb,
    newArr = [];
  
  
    arr.forEach((item, i)=> {
      if (symb !== item) {
        symb = item;
        counter = 0;
      }
  
      if (counter < size) {
        newArr.push(item);
      }

      if (!size && (size !== 0)) {
        newArr = arr;
      }
  
      counter++;
      
    })
  
   string = newArr.join("");
    return string;   
  
  }