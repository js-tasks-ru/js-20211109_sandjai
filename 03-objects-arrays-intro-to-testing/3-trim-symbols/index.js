/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(line,symbNum) {
    const arr = line.split("");
    let counter=0,
    symb,
    newArr = [];
  
  
    arr.forEach((item, i)=> {
      if (symb !== item) {
        symb = item;
        counter = 0;
      }
  
      if (counter < symbNum) {
        newArr.push(item);
      }

      if (!symbNum && (symbNum !== 0)) {
        newArr = arr;
      }
  
      counter++;
      
    })
  
   line = newArr.join("");
    return line;   
  
  }