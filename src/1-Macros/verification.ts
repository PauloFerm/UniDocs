namespace Validation {
  export function enumeration() {
    let thisSpreadsheet = SpreadsheetApp.getActive();
    let costSheet = thisSpreadsheet.getSheetByName("Presupuesto");
    let eettSheet = thisSpreadsheet.getSheetByName("EETT");

    let lastCostRow = costSheet?.getLastRow();
    let lastEETTRow = eettSheet?.getLastRow();

    if (lastCostRow == undefined || lastEETTRow == undefined) {
      throw "Problem with Costs or EETT size"
    }

    let costItems = costSheet?.getRange(2, 13, 1, lastCostRow - 12 - 11).getValues();
    let eettItems = costSheet?.getRange(2, 10, 1, lastEETTRow - 9).getValues();

    if (costItems == undefined || eettItems == undefined) {
      throw "Problem with Costs or EETT Sheet size";
    }

    function clean1DArray(array: any[][]) {
      let array1D = array.map(line => line[0]);
      return array1D.filter(item => item != "");
    }

    costItems = clean1DArray(costItems);
    eettItems = clean1DArray(eettItems);

    Logger.log(costItems);
    Logger.log(eettItems);

    for (let item in costItems) {
      if (costItems[item] != eettItems[item]) {
        throw `Non correlative items at ${costItems[item]} - ${eettItems[item]}`;
      }
    }

    if (costItems == eettItems) {
      SpreadsheetApp.getUi().alert("Enumeración Correcta");
    }
  }
}