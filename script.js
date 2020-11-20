// Array query
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updateOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];

// Drag Functionality


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    // initial mock data hard coded
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArray = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress','complete', 'onHold'];
  arrayNames.forEach((name, idx) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArray[idx]));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updateOnLoad) {
    getSavedColumns()
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((item, idx) => {
    createItemEl(backlogList, 0, item, idx);
  })
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((item, idx) => {
    createItemEl(progressList, 0, item, idx);
  })
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((item, idx) => {
    createItemEl(completeList, 0, item, idx);
  })
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((item, idx) => {
    createItemEl(onHoldList, 0, item, idx);
  })
  // Run getSavedColumns only once, Update Local Storage


}

// On Load
updateDOM();
