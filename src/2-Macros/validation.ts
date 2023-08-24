/**
 * Module to check and validate numeration in the document
 */
namespace Validation {

  /**
   * Filter empty and non-item cells 
   */
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

  export function enumeration() {
    let ui = SpreadsheetApp.getUi();
    let thisSpreadsheet = SpreadsheetApp.getActive();
    let costSheet = thisSpreadsheet.getSheetByName("Presupuesto");
    let eettSheet = thisSpreadsheet.getSheetByName("EETT");

    if (!costSheet || !eettSheet) {
      throw "Problem with Costs or EETT sheets"
    }

    let lastCostRow = costSheet.getLastRow();
    let lastEETTRow = eettSheet.getLastRow();

    let costItemsRange = costSheet.getRange(12, 2, lastCostRow - 11 - 11, 1);
    let eettItemsRange = eettSheet.getRange(10, 3, lastEETTRow - 9, 1);

    let costItems = costItemsRange.getValues();
    let eettItems = eettItemsRange.getValues();

    let alert = ui.alert(
      "Deseas ignorar vínculos rotos? (#REF!)", 
      ui.ButtonSet.YES_NO);

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