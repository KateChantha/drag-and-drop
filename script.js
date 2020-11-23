// Array query
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
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
let draggedItem;
let currentColumn;

// when item start dragging
function drag(e) {
  draggedItem = e.target;
  console.log('dragItem', draggedItem)
}

/**
 * 
 * @param {*} column 
 * ref html: column is a number hardcoded in each ul element
 * ref: <ul ondragenter="dragEnter(0)">
 */
// When Item Enters Column Area
function dragEnter(column) {
  // show backgroung color/padding to column that is over
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// Colunm Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  // remove background color/padding
  listColumns.forEach(column => {
    column.classList.remove('over');
  })
  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Update with droped items
  rebuildArrays();
}


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
  listEl.draggable = true;
  // set attribute of ondragstart to our drag fucntion
  listEl.setAttribute('ondragstart', 'drag(event)')
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
  // Run getSavedColumns only once
  updateOnLoad = true;
  // Update Local Storage
  updateSavedColumns();
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  // after drop -  browser dom is updated the HTMLCllection
  // we will need to rebuild our arrayList per dom updated contents
    // reset/ empty out each ListArray
    // push update contents to ListArray
  backlogListArray = []
  for (let i=0; i<backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = []
  for (let i=0; i<progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = []
  for (let i=0; i<completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = []
  for (let i=0; i<onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

// On Load
updateDOM();
