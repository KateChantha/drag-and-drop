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
// turn value to true when drag()
// turn value to flase when drop()
let dragging = false;

// when item start dragging
function drag(e) {
  draggedItem = e.target;
  // console.log('dragItem', draggedItem)
  dragging = true;
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
  // draggin complete
  dragging = false;
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

// Filter Array to remove empty items(null)
function filterEmptyItem(array){
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
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
  listEl.contentEditable = true;
  // onFocus Event
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
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
  backlogListArray = filterEmptyItem(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((item, idx) => {
    createItemEl(progressList, 1, item, idx);
  })
  progressListArray = filterEmptyItem(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((item, idx) => {
    createItemEl(completeList, 2, item, idx);
  })
  completeListArray = filterEmptyItem(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((item, idx) => {
    createItemEl(onHoldList, 3, item, idx);
  })
  onHoldListArray = filterEmptyItem(onHoldListArray);
  // Run getSavedColumns only once
  updateOnLoad = true;
  // Update Local Storage
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArray[column];
  // console.log('selectedArray: ', selectedArray);
  const selectedColumnEl = listColumns[column].children;
  // console.log(selectedColumnEl[id].textContent);

  if (!dragging) {
      // if content is blank/ empty
    if (!selectedColumnEl[id].textContent) {
      // this will make content to null
      delete selectedArray[id];
    } else {
      // if content is not empty, update with the current content
      selectedArray[id] = selectedColumnEl[id].textContent
    }
    updateDOM();
  }
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  // after drop -  browser dom is updated the HTMLCllection
  // we will need to rebuild our arrayList per dom updated contents
  // Important Note: backlogList.children is HTMLCollection array like object
  backlogListArray = Array.from(backlogList.children).map(el => el.textContent);
  progressListArray = Array.from(progressList.children).map(el => el.textContent);
  completeListArray = Array.from(completeList.children).map(el => el.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(el => el.textContent);
  updateDOM();
}

// Add Text Content to Column List
// and reset textbox
function addInputToColumn(column) {
  // console.log(addItems[column].textContent);
  const itemText = addItems[column].textContent;
  if (!itemText) return;
  const selectedArray = listArray[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addInputToColumn(column);
}

// On Load
updateDOM();
