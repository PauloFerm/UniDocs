function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('Arquitectura')
    .addSubMenu(ui.createMenu('Exportar')
      .addItem('Presupuesto e Itemizado', 'exportCosts')
      .addItem('EETT', 'printSpecifications'))
    //.addSubMenu(ui.createMenu('Verificar')
    //  .addItem('Enumeración', 'checkItems')
    //  .addItem('Avance', 'checkCompletion'))
    .addItem('TestFunction', 'testFunction')
    .addToUi();
}

function testFunction() {
  let thisFileId = SpreadsheetApp.getActive().getId();
  let thisFile = DriveApp.getFileById(thisFileId);

  FileManagement.saveAsPDF(thisFile);
}

function projectName(): string {
  let thisSpreadsheet = SpreadsheetApp.getActive();
  let projectName = thisSpreadsheet.getSheetByName("Presupuesto")
  
  return projectName?.getRange("C2").getValue();

}

function exportCosts() {
  let sheetName = "Presupuesto";
  let thisSpreadsheet = SpreadsheetApp.getActive();
  let sheetToExport = thisSpreadsheet.getSheetByName(sheetName);
  
  let projectName: string = sheetToExport?.getRange("C2").getValue();
  let costsSpreadsheet = FileManagement.createSheetOnSite(sheetName + " " + projectName);

  sheetToExport?.copyTo(costsSpreadsheet);

  let emptySheet = costsSpreadsheet.getSheetByName("Hoja 1");
  if (!emptySheet) { throw `There is no sheet called ${"Hoja 1"}`; }
  costsSpreadsheet.deleteSheet(emptySheet);

  // Rename and delete check columns
  let costsSheet = costsSpreadsheet.getSheetByName("Copia de " + sheetName);
  costsSheet?.setName(sheetName);
  costsSheet?.deleteColumns(10, 5);

  // Create Itemize 
  let itemsSpreadsheet = costsSpreadsheet.copy("Itemizado " + projectName);
  DriveApp.getFileById(itemsSpreadsheet.getId()).moveTo(FileManagement.entregablesFolder());

  let itemsSheet = itemsSpreadsheet.getSheetByName("Presupuesto");
  if (!itemsSheet) { throw `There is no sheet called ${"Presupuesto"}`; }
  itemsSheet.setName("Itemizado");

  let headerRows = 13;
  let footerRows = 3;
  let itemsRows = itemsSheet.getLastRow() - headerRows - footerRows;
  itemsSheet.getRange(13, 6, itemsRows, 2).setValue("");

}

function printSpecifications() {
  let thisSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let eettSpreadsheet = FileManagement.createSheetOnSite("EETT " + projectName());

  let originalEettSheet = thisSpreadsheet.getSheetByName("EETT");
  if (!originalEettSheet) { throw "Not values found on sheet EETT"; }

  // Copy content and format to new Spreadsheet
  let eettSheet = originalEettSheet.copyTo(eettSpreadsheet);
  eettSheet.setName("EETT");

  let emptySheet = eettSpreadsheet.getSheetByName("Hoja 1");
  if (!emptySheet) { throw `There is no sheet called ${"Hoja 1"}`;}
  eettSpreadsheet.deleteSheet(emptySheet);

  // Copy Header Content
  let headerRows = 7;
  let headerCols = 7;
  let originalHeaderRange = originalEettSheet.getRange(2, 4, headerRows, headerCols);
  let targetHeaderRange = eettSheet.getRange(2, 4, headerRows, headerCols);
  let headerValues = originalHeaderRange.getValues();
  targetHeaderRange.setValues(headerValues);

  // Line by line Formula check
  let lastRow = originalEettSheet.getLastRow() - headerRows;
  let lastCol = originalEettSheet.getLastColumn() - 1;

  let originalBodyRange = originalEettSheet.getRange(headerRows, 3, lastRow, lastCol);
  let originalBodyFormulas = originalBodyRange.getFormulas();
  let targetBodyRange = eettSheet.getRange(headerRows, 3, lastRow, lastCol);
  
  Logger.log([ 
    "Body Size: ",
    originalBodyRange.getNumRows(),
    originalBodyRange.getNumColumns() 
  ]);

  for (let row = 1; row < lastRow; row++) {
    let originalItemCell = originalBodyRange.getCell(row, 1);

    if (originalItemCell.getFormula() != "") {
      Logger.log(["Replaced Formula on row ", row]);

      let originalTitleCell = originalBodyRange.getCell(row, 2);
      targetBodyRange.getCell(row, 1).setValue(originalItemCell.getValue());
      targetBodyRange.getCell(row, 2).setValue(originalTitleCell.getValue());
    }
  }

  // Wait the previous for loop ends overwrite
  // Utilities.sleep(5000);
  // FileManagement.saveAsPDF(DriveApp.getFileById(eettSpreadsheet.getId()));

}

