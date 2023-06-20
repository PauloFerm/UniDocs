namespace Validation {
  export function enumeration() {
    let ui = SpreadsheetApp.getUi();
    let thisSpreadsheet = SpreadsheetApp.getActive();
    let costSheet = thisSpreadsheet.getSheetByName("Presupuesto");
    let eettSheet = thisSpreadsheet.getSheetByName("EETT");

    let lastCostRow = costSheet?.getLastRow();
    let lastEETTRow = eettSheet?.getLastRow();

    if (lastCostRow == undefined || lastEETTRow == undefined) {
      throw "Problem with Costs or EETT size"
    }

    let costItems = costSheet?.getRange(12, 2, lastCostRow - 11 - 11, 1).getValues();
    let eettItems = eettSheet?.getRange(10, 3, lastEETTRow - 9, 1).getValues();

    if (costItems == undefined || eettItems == undefined) {
      throw "Problem with Costs or EETT Sheet size";
    }

    function clean1DArray(array: any[][], ignoreREF: boolean) {
      let array1D = array.map(line => line[0]);
      let clean = array1D.filter(item => item != "")
                        .filter(item => item.indexOf("SUBTOTAL") == -1)
                        .filter(item => item.indexOf("TOTAL OBRAS") == -1)
                        .filter(item => item.indexOf("TOTAL EQUIPOS") == -1)
                        .filter(item => item.indexOf("TOTAL EQUIPAMIENTO") == -1);

      if (ignoreREF) {
        clean = clean.filter(item => item.indexOf("#REF!") == -1);
      }
      return clean
    }

    let alert = ui.alert("Ignorar Vínculos Rotos (#REF!)", ui.ButtonSet.YES_NO);
    let response = (alert == ui.Button.YES);

    costItems = clean1DArray(costItems, response);
    eettItems = clean1DArray(eettItems, response);

    // Logger.log(costItems);
    // Logger.log(eettItems);

    for (let item in costItems) {
      if (costItems[item] != eettItems[item]) {
        throw `Items no correlativos ${costItems[item]} - ${eettItems[item]}`;
      }
    }

    SpreadsheetApp.getUi().alert("Enumeración Correlativa");
    
  }
}