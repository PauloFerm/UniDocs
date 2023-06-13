function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('Arquitectura')
    .addSubMenu(ui.createMenu('Exportar')
      .addItem('Presupuesto e Itemizado', 'exportCosts')
      .addItem('EETT', 'printSpecifications'))
    .addSubMenu(ui.createMenu('Verificar')
      .addItem('Enumeración', 'enumeration'))
    //  .addItem('Avance', 'checkCompletion'))
    .addItem('TestFunction', 'testFunction')
    .addToUi();
}

function testFunction() {
  let thisFileId = SpreadsheetApp.getActive().getId();
  let thisFile = DriveApp.getFileById(thisFileId);

  FileManagement.saveAsPDF(thisFile);
}

var exportCosts = ExportFiles.exportCosts();
var printSpecifications = ExportFiles.printSpecifications();
var enumeration = Validation.enumeration();
