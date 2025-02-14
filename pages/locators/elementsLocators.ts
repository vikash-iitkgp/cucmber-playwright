export const ElementsLocators = {
    elementsButton: 'text=Elements',
    webTablesButton: 'text=Web Tables',
    addButton: '#addNewRecordButton',
    firstNameInput: '#firstName',
    lastNameInput: '#lastName',
    emailInput: '#userEmail',
    ageInput: '#age',
    salaryInput: '#salary',
    departmentInput: '#department',
    submitButton: '#submit',
    tableRow: '.rt-tr-group',
    editButton: '.action-buttons span[title="Edit"]',
    deleteButton: '.action-buttons span[title="Delete"]',
  };
  
  export class WebTableLocators {
    static elementsButton = 'text=Elements';
    static webTableMenu = 'li#item-3:has-text("Web Tables")';  // Locator for WebTable menu item
    static addButton = '#addNewRecordButton';
    static firstNameInput = '#firstName';
    static lastNameInput = '#lastName';
    static emailInput = '#userEmail';
    static ageInput = '#age';
    static salaryInput = '#salary';
    static departmentInput = '#department';
    static submitButton = '#submit';
    static searchBox = '#searchBox';
    static deleteButton = 'span[title="Delete"]';
    static editButton = 'span[title="Edit"]';
    static tableRows = '.rt-tr-group';
    static closeButton = 'button.close';
    static formModel = '#registration-form-modal';
  }
  export class FileLocators {
    static elementsButton = 'text=Elements';
    static uploadAndDownloadMenu = 'li#item-7:has-text("Upload and Download")';  // Locator for Upload and Download menu item
    static uploadButton = '#uploadFile';
    static uploadedFilePath = '#uploadedFilePath';
    static downloadButton = '#downloadButton';
  }