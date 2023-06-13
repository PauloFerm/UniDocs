namespace FileManagement {

  type Folder = GoogleAppsScript.Drive.Folder;
  type File = GoogleAppsScript.Drive.File;
  type SpreadsheetFile = GoogleAppsScript.Spreadsheet.Spreadsheet


  /**
   * @returns Parent folder of the file that runs the File
   */
  export function parentFolder() {
    let fileId = SpreadsheetApp.getActive().getId();
    let thisFile = DriveApp.getFileById(fileId);
    let parentFolder: Folder = thisFile.getParents().next();

    return parentFolder;
  }

  /**
   * @returns Folder named "Entregables" next to the File
   */
  export function entregablesFolder() {
    let parent = FileManagement.parentFolder();

    return parent.getFoldersByName("Entregables").next();
  }

  /**
   * Get or create a Folder with the name `folderName`
   */
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

  /**
   * Save the input `file` as PDF in "Entregable" Folder
   * @returns PDF File
   */
  export function saveAsPDF(file: File) {
    // let copy = file.makeCopy();
    let pdfContent = file.getAs("application/PDF");
    let pdfFile = DriveApp.createFile(pdfContent);
    
    pdfFile.setName("EETT.pdf");
    pdfFile.moveTo(FileManagement.entregablesFolder());

    // copy.setTrashed(true);

    return pdfFile;
  }

  /**
   * Copy a sheet from a Spreadsheet to another
   * @param spreadsheet Original Spreadsheet to extract a Sheet
   * @param sheetName Name of the Sheet to copy 
   * @param newSpreadSheet New Spreadsheet to insert the Sheet
   * @returns The New Spreadsheet
   */
  export function saveSheet(
    spreadsheet: SpreadsheetFile, 
    sheetName: string, 
    newSpreadsheet: SpreadsheetFile) {
    let sheetToExport = spreadsheet.getSheetByName(sheetName);
    
    if (!sheetToExport) {
      throw `There is no sheet called ${sheetName}`;
    }

    sheetToExport.copyTo(newSpreadsheet);

    return newSpreadsheet;
  }

  /**
   * Create a Spreadsheet next to the File
   * @param spreadsheetName for the new Spreadsheet
   * @returns The new Spreadsheet
   */
  export function createSheetOnSite(spreadsheetName: string) {
    let costsSpreadsheet = SpreadsheetApp.create(spreadsheetName);
    let costsFile = DriveApp.getFileById(costsSpreadsheet.getId());

    costsFile.moveTo(FileManagement.entregablesFolder());

    return costsSpreadsheet;
  }

}
