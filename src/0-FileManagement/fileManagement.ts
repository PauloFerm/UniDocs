namespace FileManagement {

  type Folder = GoogleAppsScript.Drive.Folder;
  type File = GoogleAppsScript.Drive.File;
  type SpreadsheetFile = GoogleAppsScript.Spreadsheet.Spreadsheet


  export function parentFolder() {
    let fileId = SpreadsheetApp.getActive().getId();
    let thisFile = DriveApp.getFileById(fileId);
    let parentFolder: Folder = thisFile.getParents().next();

    return parentFolder;
  }

  export function entregablesFolder() {
    let parent = FileManagement.parentFolder();

    return parent.getFoldersByName("Entregables").next();
  }

  export function getOrCreateFolder(folderName: string): Folder {

    let parentFolder = FileManagement.parentFolder();
    let innerFolders = parentFolder.getFolders();

    while (innerFolders.hasNext()) {
      let innerFolder = innerFolders.next();

      if (innerFolder.getName() == folderName) {
        Logger.log("Folder already exists");
        return innerFolder;
      }
    }

    let newFolder = DriveApp.createFolder(folderName);
    newFolder.moveTo(parentFolder);

    Logger.log("Folder created");

    return newFolder;
  }

  export function saveAsPDF(file: File) {
    // let copy = file.makeCopy();
    let pdfContent = file.getAs("application/PDF");
    let pdfFile = DriveApp.createFile(pdfContent);
    
    pdfFile.setName("EETT.pdf");
    pdfFile.moveTo(FileManagement.entregablesFolder());

    // copy.setTrashed(true);

    return pdfFile;
  }

  export function saveSheet(
    spreadsheet: SpreadsheetFile, 
    sheetName: string, 
    newSpreadSheet: SpreadsheetFile) {
    let sheetToExport = spreadsheet.getSheetByName(sheetName);
    
    if (!sheetToExport) {
      throw `There is no sheet called ${sheetName}`;
    }

    sheetToExport.copyTo(newSpreadSheet);

    return newSpreadSheet;
  }

  export function createSheetOnSite(spreadsheetName: string): SpreadsheetFile {
    let costsSpreadsheet = SpreadsheetApp.create(spreadsheetName);
    let costsFile = DriveApp.getFileById(costsSpreadsheet.getId());

    costsFile.moveTo(FileManagement.entregablesFolder());

    return costsSpreadsheet;
  }

}
