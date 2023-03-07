namespace FileManagement {

  type Folder = GoogleAppsScript.Drive.Folder;
  type File = GoogleAppsScript.Drive.File;

  export function parentFolder() {
    let fileId = SpreadsheetApp.getActive().getId();
    let thisFile = DriveApp.getFileById(fileId);
    let parentFolder: Folder = thisFile.getParents().next();

    return parentFolder;
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
    pdfFile.moveTo(FileManagement.parentFolder());

    // copy.setTrashed(true);

    return pdfFile;
  }

}
