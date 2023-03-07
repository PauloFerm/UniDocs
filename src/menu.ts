function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('Arquitectura')
    .addSubMenu(ui.createMenu('Exportar')
      .addItem('Presupuesto', 'exportCosts')
      .addItem('Itemizado', 'exportItems')
      .addItem('EETT', 'printSpecifications')
      .addItem('EETT Editable', 'exportSpecification'))
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
