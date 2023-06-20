/**
 * Module to manage files and folder in Google Drive
 */
namespace DriveFS {
  type Folder = GoogleAppsScript.Drive.Folder;
  type File = GoogleAppsScript.Drive.File;
  type SpreadsheetFile = GoogleAppsScript.Spreadsheet.Spreadsheet;

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
   * Get or create a Folder next to the source file by name
   */
  export function getOrCreateFolder(folderName: string): Folder {

    let parentFolder = DriveFS.parentFolder();
    let childFolders = parentFolder.getFolders();

    while (childFolders.hasNext()) {
      let childFolder = childFolders.next();

      if (childFolder.getName() == folderName) {
        Logger.log(`Folder ${folderName} already exists`);
        return childFolder;
      }
    }

    // let newFolder = DriveApp.createFolder(folderName);
    // newFolder.moveTo(parentFolder);

    let newFolder = parentFolder.createFolder(folderName);
    Logger.log(`Folder ${folderName} created`);

    return newFolder;
  }

  export function getOrCreateSpreadsheet(fileName: string) {
    return
  }

  /**
   * Save the input `file` as PDF in "Entregable" Folder
   * @returns PDF File
   */
  export function saveAsPDF(file: File, folder: Folder) {
    // let copy = file.makeCopy();
    let pdfContent = file.getAs("application/PDF");
    let pdfFile = DriveApp.createFile(pdfContent);
    
    pdfFile.setName("EETT.pdf");
    pdfFile.moveTo(folder);

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
  export function saveSheetAsFile(
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
   * @param spreadsheetName Name for the new Spreadsheet
   * @param folder Destination folder
   * @returns The new Spreadsheet generated
   */
  export function createSheetIn(spreadsheetName: string, folder: Folder) {
    let newSpreadSheet = SpreadsheetApp.create(spreadsheetName);
    let newFile = DriveApp.getFileById(newSpreadSheet.getId());

    newFile.moveTo(folder);

    return newSpreadSheet;
  }

}
