// popup-utils.js
const extensionTitle = "Extensão Ohad"; // Define it globally
const testingMode = false;

function saveItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem(getCurrentDateTime(), string);
}

function fetchItems() {

    const itemsList = document.querySelector('ul.todo-items');
    itemsList.innerHTML = '';
    var newItemHtml = '';
    var incompleteTasks = 0;

    try {
        var items = localStorage.getItem(getCurrentDateTime());
        var itemsArr = JSON.parse(items);

        for (var i = 0; i < itemsArr.length; i++) {
            var status = ''
            if (itemsArr[i].status == 1) {
                status = 'class="done"';

                newItemHtml += `<li data-itemindex="${i}" ${status}>
        <span class="item">${itemsArr[i].item}</span>
        <div>
            <span class="itemComplete"><img src="../assets/icons/check-square.svg" alt="ícone tarefa completa" width="16" height="16"></span>
            <span class="itemEdit"><img src="../assets/icons/edit.svg" alt="ícone editar tarefa" width="16" height="16"></span>
            <span class="itemDelete"><img src="../assets/icons/trash.svg" alt="ícone excluir tarefa" width="16" height="16"></span>
        </div>
        </li>`;

            } else {
                newItemHtml += `<li data-itemindex="${i}" ${status}>
            <span class="item">${itemsArr[i].item}</span>
            <div>
            <span class="itemComplete"><img src="../assets/icons/square.svg" alt="ícone tarefa a fazer" width="16" height="16"></span>
            <span class="itemEdit"><img src="../assets/icons/edit.svg" alt="ícone editar tarefa" width="16" height="16"></span>
            <span class="itemDelete"><img src="../assets/icons/trash.svg" alt="ícone excluir tarefa" width="16" height="16"></span>
            </div>
            </li>`;

                incompleteTasks++;
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

        if (incompleteTasks > 0) {
            chrome.action.setBadgeText({ text: incompleteTasks.toString() })
        } else {
            chrome.action.setBadgeText({ text: "✓" })
        }

    } catch (error) {
        var items = localStorage.getItem('recurring-todo-items');
        var itemsArr = JSON.parse(items);

        var dailyItems = [];

        try {

            if (itemsArr.length != null) {

                for (var i = 0; i < itemsArr.length; i++) {
                    var value = itemsArr[i].item;
                    dailyItems.push({ "item": value, "status": 0 })
                    const dailyItemsStr = JSON.stringify(dailyItems);
                    saveItems(dailyItems)
                }
                fetchItems();
            }
        } catch (error) {
            const dailyItemsStr = JSON.stringify(dailyItems);
            saveItems(dailyItems)
        }

    }

}

function itemComplete(index) {
    var itemsStorage = localStorage.getItem(getCurrentDateTime());
    var itemsArr = JSON.parse(itemsStorage);

    if (itemsArr[index].status == 0) {
        itemsArr[index].status = 1;
    } else {
        itemsArr[index].status = 0;
    }

    saveItems(itemsArr);
    fetchItems();
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    if (testingMode) {
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const min = minute.substring(0, 1)
        return `${year}-${month}-${day}-${hour}-${min}`;
    }
    return `${year}-${month}-${day}`;
}

function getCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('pt-BR', options);
    return formattedDate;
}

function itemEdit(index) {
    document.querySelector('.create-task-btn').style.display = 'none';
    document.querySelector('.create-and-edit-daily-task-container').style.display = 'block';
    document.querySelector('.create-daily-task-container').style.display = 'none';
    document.querySelector('.edit-daily-task-container').style.display = 'block';

    var itemsStorage = localStorage.getItem(getCurrentDateTime());
    var itemsArr = JSON.parse(itemsStorage);

    document.querySelector('.edit-daily-task input').value = itemsArr[index].item;
    editingTaskIndex = index;
    fetchItems();
}

function itemDelete(index) {
    var itemsStorage = localStorage.getItem(getCurrentDateTime());
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr.splice(index, 1);

    saveItems(itemsArr);

    chrome.notifications.create("notificationId", {
        type: "basic",
        iconUrl: "../assets/icons/icon_128.png",
        title: extensionTitle,
        message: "Tarefa diária excluída"
    });
    fetchItems();
}

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
            <span class="recurringItemEdit"><img src="../assets/icons/edit.svg" alt="square" width="16" height="16"></span>
            <span class="recurringItemDelete"><img src="../assets/icons/trash.svg" alt="square" width="16" height="16"></span>
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
    document.querySelector('.create-recurring-task-container').style.display = 'none';
    document.querySelector('.create-recurring-task-button').style.display = 'none';
    document.querySelector('.create-and-edit-recurring-task-container').style.display = 'block';
    document.querySelector('.edit-recurring-task-container').style.display = 'block';

    var itemsStorage = localStorage.getItem('recurring-todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    document.querySelector('.edit-recurring-task input').value = itemsArr[index].item;
    editingTaskIndex = index;
    fetchRecurringItems();
}

function recurringItemDelete(index) {
    var itemsStorage = localStorage.getItem('recurring-todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr.splice(index, 1);

    saveRecurringItems(itemsArr);

    chrome.notifications.create("notificationId", {
        type: "basic",
        iconUrl: "../assets/icons/icon_128.png",
        title: extensionTitle,
        message: "Tarefa excluída da lista de tarefas recorrentes."
    });
    fetchRecurringItems();
}

function saveRecurringItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem('recurring-todo-items', string);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveItems,
        fetchItems,
        itemComplete,
        getCurrentDateTime,
        getCurrentDate,
        itemEdit,
        itemDelete,
        fetchRecurringItems,
        recurringItemEdit,
        recurringItemDelete,
        saveRecurringItems,
    };
}