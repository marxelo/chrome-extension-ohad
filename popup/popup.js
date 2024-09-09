const items = [{ "item": "Record next video", "status": 0 },
{ "item": "Record another video", "status": 1 },]

const itemsStr = JSON.stringify(items);

console.log(items)
console.log(itemsStr)

const recurringItems = [{ "item": "Record next video" },
    { "item": "Record another video" },]
    
    const recurringItemsStr = JSON.stringify(recurringItems);
    
    console.log(recurringItems)
    console.log(recurringItemsStr)

document.querySelector('.create-task').addEventListener('click', function () {
    document.querySelector('.new-task').style.display = 'block';
})

document.querySelector('.new-task button').addEventListener('click', function () {
    var itemName = document.querySelector('.new-task input').value;

    if (itemName != '') {

        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(itemsStorage);

        itemsArr.push({ "item": itemName, "status": 0 });

        saveItems(itemsArr);
        fetchItems();
        document.querySelector('.new-task input').value = '';
        document.querySelector('.new-task').style.display = 'none';
    }
})

function fetchItems() {

    const itemsList = document.querySelector('ul.todo-items');
    itemsList.innerHTML = '';
    var newItemHtml = '';

    try {
        var items = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(items);

        for (var i = 0; i < itemsArr.length; i++) {
            var status = ''
            if (itemsArr[i].status == 1) {
                status = 'class="done"';
            }

            newItemHtml += `<li data-itemindex="${i}" ${status}>
            <span class="item">${itemsArr[i].item}</span>
            <div>
                <span class="itemComplete">&#10004;</span>
                <span class="itemDelete">&#10006;</span>
            </div>
            </li>`;
        }

        itemsList.innerHTML = newItemHtml;

        var itemsListUL = document.querySelectorAll('ul.todo-items li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.itemComplete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemComplete(index);
            });
            itemsListUL[i].querySelector('.itemDelete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemDelete(index);
            });

        }

    } catch (error) {

    }

}

function itemComplete(index) {
    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr[index].status = 1;

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').className = 'done';

}

function itemDelete(index) {
    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr.splice(index, 1);

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').remove();
}

function saveItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem('todo-items', string);
}

document.querySelector('.create-recurring-task').addEventListener('click', function () {
    document.querySelector('.new-recurring-task').style.display = 'block';
    document.querySelector('.recurring-todo-items').style.display = 'block';
    fetchRecurringItems();
})

document.querySelector('.new-recurring-task button').addEventListener('click', function () {
    var itemName = document.querySelector('.new-recurring-task input').value;

    if (itemName != '') {

        var itemsStorage = localStorage.getItem('recurring-todo-items');
        var itemsArr = JSON.parse(itemsStorage);

        itemsArr.push({"item": itemName });

        saveRecurringItems(itemsArr);
        fetchRecurringItems();
        document.querySelector('.new-recurring-task input').value = '';
        document.querySelector('.new-recurring-task').style.display = 'none';
    }
})

function fetchRecurringItems() {

    const itemsList = document.querySelector('ul.recurring-todo-items');
    itemsList.innerHTML = '';
    var newItemHtml = '';

    try {
        var items = localStorage.getItem('recurring-todo-items');
        var itemsArr = JSON.parse(items);

        for (var i = 0; i < itemsArr.length; i++) {

            newItemHtml += `<li data-itemindex="${i}">
            <span class="item">${itemsArr[i].item}</span>
            <div>
                <span class="recurringItemEdit">&#9998;</span>
                <span class="recurringItemDelete">&#10006;</span>
            </div>
            </li>`;
        }

        itemsList.innerHTML = newItemHtml;

        var itemsListUL = document.querySelectorAll('ul.recurring-todo-items li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.recurringItemEdit').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                recurringItemEdit(index);
            });
            itemsListUL[i].querySelector('.recurringItemDelete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                recurringItemDelete(index);
            });

        }

    } catch (error) {
        localStorage.setItem('recurring-todo-items', '[]');       
    }

}

function recurringItemEdit(index) {
    var itemsStorage = localStorage.getItem('recurring-todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr[index].item = itemsArr[index].item + '1';

    saveRecurringItems(itemsArr);

    fetchRecurringItems();
    document.querySelector('.new-recurring-task input').value = '';
    document.querySelector('.new-recurring-task').style.display = 'none';

}

function recurringItemDelete(index) {
    var itemsStorage = localStorage.getItem('recurring-todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr.splice(index, 1);

    saveRecurringItems(itemsArr);

    document.querySelector('ul.recurring-todo-items li[data-itemindex="' + index + '"]').remove();
}

function saveRecurringItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem('recurring-todo-items', string);
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}-${hour}-${minute}`;
}

const currentDateTime = getCurrentDateTime();
console.log(currentDateTime); // Output: 2024-09-08-23-19 (example)

fetchItems();