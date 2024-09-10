var editingTaskIndex = 0;
var isClosed = true;

document.querySelector('.create-task').addEventListener('click', function () {
    document.querySelector('.new-task').style.display = 'block';
    document.querySelector('.edit-daily-task-wrapper').style.display = 'none';
    document.querySelector('.create-task').style.display = 'none';
})

document.querySelector('.new-task button').addEventListener('click', function () {
    var itemName = document.querySelector('.new-task input').value;

    if (itemName.trim() != '') {
        var itemsStorage = localStorage.getItem(getCurrentDateTime());
        var itemsArr = JSON.parse(itemsStorage);

        itemsArr.push({ "item": itemName, "status": 0 });

        saveItems(itemsArr);
        fetchItems();
        document.querySelector('.new-task input').value = '';
        document.querySelector('.new-task').style.display = 'none';
        document.querySelector('.create-task').style.display = 'block';
    }
})

document.querySelector('.edit-daily-task button').addEventListener('click', function () {
    var itemName = document.querySelector('.edit-daily-task input').value;

    if (itemName.trim() != '') {
        var itemsStorage = localStorage.getItem(getCurrentDateTime());
        var itemsArr = JSON.parse(itemsStorage);

        itemsArr[editingTaskIndex].item = itemName;

        saveItems(itemsArr);
        fetchItems();
        document.querySelector('.edit-daily-task input').value = '';
        document.querySelector('.edit-daily-task-wrapper').style.display = 'none';
        document.querySelector('.create-task').style.display = 'block';
    }
})

function fetchItems() {

    const itemsList = document.querySelector('ul.todo-items');
    itemsList.innerHTML = '';
    var newItemHtml = '';

    try {
        // var items = localStorage.getItem('todo-items');
        var items = localStorage.getItem(getCurrentDateTime());
        var itemsArr = JSON.parse(items);

        for (var i = 0; i < itemsArr.length; i++) {
            var status = ''
            if (itemsArr[i].status == 1) {
                status = 'class="done"';

                newItemHtml += `<li data-itemindex="${i}" ${status}>
            <span class="item">${itemsArr[i].item}</span>
            <div>
                <span class="itemComplete"><img src="../images/check-square.svg" alt="ícone tarefa completa" width="16" height="16"></span>
                <span class="itemEdit"><img src="../images/edit.svg" alt="ícone editar tarefa" width="16" height="16"></span>
                <span class="itemDelete"><img src="../images/trash.svg" alt="ícone excluir tarefa" width="16" height="16"></span>
            </div>
            </li>`;

            } else {
                newItemHtml += `<li data-itemindex="${i}" ${status}>
                <span class="item">${itemsArr[i].item}</span>
                <div>
                <span class="itemComplete"><img src="../images/square.svg" alt="ícone tarefa a fazer" width="16" height="16"></span>
                <span class="itemEdit"><img src="../images/edit.svg" alt="ícone editar tarefa" width="16" height="16"></span>
                <span class="itemDelete"><img src="../images/trash.svg" alt="ícone excluir tarefa" width="16" height="16"></span>
                </div>
                </li>`;
            }
        }

        itemsList.innerHTML = newItemHtml;

        var itemsListUL = document.querySelectorAll('ul.todo-items li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.itemComplete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemComplete(index);
            });
            itemsListUL[i].querySelector('.itemEdit').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemEdit(index);
            });
            itemsListUL[i].querySelector('.itemDelete').addEventListener('click', function () {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemDelete(index);
            });

        }

    } catch (error) {
        var items = localStorage.getItem('recurring-todo-items');
        var itemsArr = JSON.parse(items);
        console.log(items)
        var dailyItems = [];

        for (var i = 0; i < itemsArr.length; i++) {
            var value = itemsArr[i].item;
            console.log(itemsArr[i].item)
            console.log(itemsArr[i].item.value)
            dailyItems.push({ "item": value, "status": 0 })
            const dailyItemsStr = JSON.stringify(dailyItems);
            console.log(dailyItems)
            console.log(dailyItemsStr)
            saveItems(dailyItems)
        }
        fetchItems();
    }

}

function itemComplete(index) {
    var itemsStorage = localStorage.getItem(getCurrentDateTime());
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr[index].status = 1;

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').className = 'done';

}

function itemEdit(index) {
    console.log('aqui')
    document.querySelector('.create-task').style.display = 'none';
    document.querySelector('.new-task').style.display = 'none';
    document.querySelector('.edit-daily-task-wrapper').style.display = 'block';
    document.querySelector('.recurring-task-container').style.display = 'none';

    var itemsStorage = localStorage.getItem(getCurrentDateTime());
    var itemsArr = JSON.parse(itemsStorage);

    document.querySelector('.edit-daily-task input').value = itemsArr[index].item;
    editingTaskIndex = index;
}

function itemDelete(index) {
    var itemsStorage = localStorage.getItem(getCurrentDateTime());
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr.splice(index, 1);

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="' + index + '"]').remove();
}

function saveItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem(getCurrentDateTime(), string);
}

document.querySelector('.recurring-task-button').addEventListener('click', function () {
    if (isClosed) {
        document.querySelector('.recurring-task-container').style.display = 'block';
        document.querySelector('.recurring-todo-items').style.display = 'block';
        fetchRecurringItems();
        isClosed = false;
    } else {
        document.querySelector('.recurring-task-container').style.display = 'none';
        isClosed = true;
    }
})

document.querySelector('.create-recurring-task-button').addEventListener('click', function () {
    document.querySelector('.new-recurring-task').style.display = 'block';
    document.querySelector('.create-recurring-task-wrapper').style.display = 'block';
    document.querySelector('.edit-recurring-task-wrapper').style.display = 'none';
    document.querySelector('.create-recurring-task-button').style.display = 'none';
})

document.querySelector('.new-recurring-task button').addEventListener('click', function () {
    var itemName = document.querySelector('.new-recurring-task input').value;

    if (itemName != '') {

        var itemsStorage = localStorage.getItem('recurring-todo-items');
        var itemsArr = JSON.parse(itemsStorage);

        itemsArr.push({ "item": itemName });

        saveRecurringItems(itemsArr);
        fetchRecurringItems();
        document.querySelector('.new-recurring-task input').value = '';
        document.querySelector('.new-recurring-task').style.display = 'none';
        document.querySelector('.create-recurring-task-wrapper').style.display = 'none';
        document.querySelector('.create-recurring-task-button').style.display = 'block';
    }
})

document.querySelector('.edit-recurring-task button').addEventListener('click', function () {
    var itemName = document.querySelector('.edit-recurring-task input').value;

    if (itemName != '') {
        var itemsStorage = localStorage.getItem('recurring-todo-items');
        var itemsArr = JSON.parse(itemsStorage);
        itemsArr[editingTaskIndex].item = itemName;

        saveRecurringItems(itemsArr);
        fetchRecurringItems();
        document.querySelector('.edit-recurring-task input').value = '';
        document.querySelector('.edit-recurring-task-wrapper').style.display = 'none';
        // document.querySelector('.create-recurring-task-wrapper').style.display = 'block';
        document.querySelector('.create-recurring-task-button').style.display = 'block';
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
                <span class="recurringItemEdit"><img src="../images/edit.svg" alt="square" width="16" height="16"></span>
                <span class="recurringItemDelete"><img src="../images/trash.svg" alt="square" width="16" height="16"></span>
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
    document.querySelector('.create-recurring-task-wrapper').style.display = 'none';
    document.querySelector('.create-recurring-task-button').style.display = 'none';
    document.querySelector('.edit-recurring-task').style.display = 'block';
    document.querySelector('.edit-recurring-task-wrapper').style.display = 'block';

    var itemsStorage = localStorage.getItem('recurring-todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    document.querySelector('.edit-recurring-task input').value = itemsArr[index].item;
    editingTaskIndex = index;
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
    const min = minute.substring(0, 1)

    return `${year}-${month}-${day}-${hour}-${min}`;
}

const currentDateTime = getCurrentDateTime();

function getCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('pt-BR',
        options);
    return formattedDate;
}


console.log(currentDateTime); // Output: 2024-09-08-23-19 (example)
document.getElementById("currentDate").innerHTML = getCurrentDate();

fetchItems();