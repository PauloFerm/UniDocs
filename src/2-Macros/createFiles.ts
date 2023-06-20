/**
 * Module to manage export documents from main Spreadsheet
 */
namespace ExportFiles {
  type Sheet = GoogleAppsScript.Spreadsheet.Sheet;

  /**
   * @returns Project name in Cell 'C2'
   */
  function projectName(): string {
    let thisSpreadsheet = SpreadsheetApp.getActive();
    let projectName = thisSpreadsheet.getSheetByName("Presupuesto");
    
    return projectName?.getRange("C2").getValue();
  }

  /**
   * @returns Folder named "Entregables" next to the File
   */
  export function entregablesFolder() {
    // let parent = DriveFS.parentFolder();
    // return parent.getFoldersByName("Entregables").next();

    return DriveFS.getOrCreateFolder("Entregables");
  }

  /**
   * Export a Sheet in a new Spreadsheet with the same name
   * @returns Spreadsheet generated
   */
  function exportSheet(sheet: Sheet) {
    let newSpreadsheet = DriveFS.createSheetIn(
      `${sheet.getName()} ${projectName()}`, 
      ExportFiles.entregablesFolder()
    );
  
    // Delete default empty sheet
    let emptySheet = newSpreadsheet.getSheetByName("Hoja 1");
    if (!emptySheet) { throw `There is no sheet called ${"Hoja 1"}`; }
    newSpreadsheet.deleteSheet(emptySheet);

    sheet.copyTo(newSpreadsheet);

    return newSpreadsheet;
  }

  /**
   * `MACRO` for export Cost and Itemized Sheets
   */
  export function exportCosts() {
    let sheetName = "Presupuesto";
    let sourceSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sourceSheet = sourceSpreadsheet.getSheetByName(sheetName);

    // Create temporal Sheet
    sourceSheet?.copyTo(sourceSpreadsheet);

    let costsSheet = sourceSpreadsheet.getSheetByName(`Copy of ${sheetName}`);
    if (costsSheet == null) { 
      throw `There is no sheet called Copy of ${sheetName}`
    }

    // Format for 'Presupuesto': Delete Check columns
    costsSheet.setName(`${sheetName} ${projectName()}`);
    costsSheet.deleteColumns(10, 5);
    exportSheet(costsSheet);

    // Format for 'Itemizado': Clean Quantities and Unit Prices
    costsSheet.setName(`Itemizado ${projectName()}`);
    let headRows = 13;
    let footRows = 3;
    let itemsRows = costsSheet.getLastRow() - headRows - footRows;
    costsSheet.getRange(13, 6, itemsRows, 2).setValue("");
    exportSheet(costsSheet);

    // Delete temporal Sheet
    sourceSpreadsheet.deleteSheet(costsSheet);
  }
  
  /**
   * `MACRO` to export EETT Sheet without links and formulas
   * @returns Exported Spreadsheet
   */
  export function exportSpecifications() {
    let sourceSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sourceEett = sourceSpreadsheet.getSheetByName("EETT");
    if (!sourceEett) { throw "Not values found on sheet EETT"; }
  
    // Create temporal Sheet
    let eettSheet = sourceEett.copyTo(sourceSpreadsheet);
    eettSheet.setName(`EETT ${projectName()}`);

    // Copy Head Content
    let headRows = 7;
    let headCols = 7;
    let sourceHeadRange = sourceEett.getRange(2, 4, headRows, headCols);
    let targetHeadRange = eettSheet.getRange(2, 4, headRows, headCols);
    let headValues = sourceHeadRange.getValues();
    targetHeadRange.setValues(headValues);
  
    // Check if formula in titles to change for values
    let lastRow = sourceEett.getLastRow() - headRows;
    let sourceBodyRange = sourceEett.getRange(headRows, 3, lastRow, 2);
    let sourceBodyFormulas = sourceBodyRange.getFormulas();
    let sourceBodyValues = sourceBodyRange.getValues();
    
    Logger.log([ 
      "Body Size: ",
      sourceBodyRange.getNumRows(),
      sourceBodyRange.getNumColumns() 
    ]);

    let targetBodyRange = eettSheet.getRange(headRows, 3, lastRow, 2);

    for (let row = 1; row < lastRow; row++) {
      if (sourceBodyFormulas[row][0] != "") {
        Logger.log(["Replaced Formula on row ", row]);
        targetBodyRange.getCell(row, 1).setValue(sourceBodyValues[row][1]);
        targetBodyRange.getCell(row, 2).setValue(sourceBodyValues[row][2]);
      }
    }

    let eettSpreadsheet = exportSheet(eettSheet);
    sourceSpreadsheet.deleteSheet(eettSheet);
  
    return eettSpreadsheet;
  }

  /**
   * `MACRO` to export EETT sheet as PDF (on dev)
   */
  export function printSpecifications() {

    let eettSpreadsheet = ExportFiles.exportSpecifications();
    let eettFile = DriveApp.getFileById(eettSpreadsheet.getId());
    let entregables = ExportFiles.entregablesFolder();

    // Wait the previous for loop ends overwrite
    // Utilities.sleep(5000);
    DriveFS.saveAsPDF(eettFile, entregables);
  }
      
}