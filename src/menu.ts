// Source code on https://github.com/PauloFerm/UniDocs.git

function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('Arquitectura')
    .addSubMenu(ui.createMenu('Exportar')
      .addItem('Presupuesto', 'exportCosts')
    //  .addItem('Itemizado', 'exportItems')
    //  .addItem('EETT (PDF)', 'printSpecifications')
      .addItem('EETT', 'exportSpecifications'))

    .addSubMenu(ui.createMenu('Verificar')
      .addItem('Enumeración', 'enumeration'))
    //  .addItem('Avance', 'checkCompletion'))
    //  .addItem('TestFunction', 'testFunction')
    .addToUi();
}

function testFunction() {
  let thisFileId = SpreadsheetApp.getActive().getId();
  let thisFile = DriveApp.getFileById(thisFileId);

  FileManagement.saveAsPDF(thisFile);
}

var exportCosts = ExportFiles.exportCosts;
var exportSpecifications = ExportFiles.exportSpecifications;
var enumeration = Validation.enumeration;
