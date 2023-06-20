namespace ArrayUtils{
  /**
   * Transpose any 2D Array
   */
  export function transpose(array: any[][]) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
  }

  /** Fill elements in `mainArray` if `fillArray` has values for it */
  export function fillEmpty(mainArray: any[][], fillArray: any[][]) {
    let sameLength = (row: any[]) => { row.length == mainArray[0].length; }
    if (
      mainArray.length != fillArray.length ||
      mainArray.every(sameLength) ||
      fillArray.every(sameLength)) {
      throw "Arrays have not the same shape";
    }

    let newArray = mainArray.map((row, rowIndex) => {
        return row.map((value, colIndex) => {
          if (value == "" && fillArray[rowIndex][colIndex] != "") {
            return fillArray[rowIndex][colIndex]
          } else {
            return value
          }
        })
    });

    return newArray
  }
}