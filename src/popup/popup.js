var editingTaskIndex = 0;
var isClosed = true;


function initializePopup() {
    document.querySelector('.create-task-btn').addEventListener('click', function () {
        document.querySelector('.create-and-edit-daily-task-container').style.display = 'block';
        document.querySelector('.create-daily-task-container').style.display = 'block';
        document.querySelector('.edit-daily-task-container').style.display = 'none';
        document.querySelector('.create-task-btn').style.display = 'none';
    })

    document.querySelector('.create-daily-task-container button').addEventListener('click', function () {
        var itemName = document.querySelector('.create-daily-task-container input').value;

        if (itemName.trim() != '') {
            var itemsStorage = localStorage.getItem(getCurrentDateTime());
            var itemsArr = JSON.parse(itemsStorage);

            itemsArr.push({ "item": itemName, "status": 0 });

            saveItems(itemsArr);
            fetchItems();
            document.querySelector('.create-daily-task-container input').value = '';
            document.querySelector('.create-and-edit-daily-task-container').style.display = 'none';
            document.querySelector('.create-daily-task-container').style.display = 'none';
            document.querySelector('.create-task-btn').style.display = 'block';
            chrome.notifications.create("notificationId", {
                type: "basic",
                iconUrl: "../images/icon-128.png",
                title: extensionTitle,
                message: "Tarefa diária adicionada"
            });
        }
    })

    // cancel task creation
    document.querySelector('.create-daily-task-container .btnCancel').addEventListener('click', function () {
        document.querySelector('.create-and-edit-daily-task-container').style.display = 'none';
        document.querySelector('.create-daily-task-container').style.display = 'none';
        document.querySelector('.create-task-btn').style.display = 'block';
        chrome.notifications.create("notificationId", {
            type: "basic",
            iconUrl: "../images/icon-128.png",
            title: extensionTitle,
            message: "Criação de tarefa diária cancelada"
        });
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
            document.querySelector('.edit-daily-task-container').style.display = 'none';
            document.querySelector('.create-and-edit-daily-task-container').style.display = 'none';
            document.querySelector('.create-task-btn').style.display = 'block';
            chrome.notifications.create("notificationId", {
                type: "basic",
                iconUrl: "../images/icon-128.png",
                title: extensionTitle,
                message: "Tarefa diária alterada"
            });
        }
    })

    // Cancel daily task editing
    document.querySelector('.edit-daily-task .btnCancel').addEventListener('click', function () {
        document.querySelector('.edit-daily-task-container').style.display = 'none';
        document.querySelector('.create-and-edit-daily-task-container').style.display = 'none';
        document.querySelector('.create-task-btn').style.display = 'block';
        chrome.notifications.create("notificationId", {
            type: "basic",
            iconUrl: "../images/icon-128.png",
            title: extensionTitle,
            message: "Alteração cancelada"
        });
    })

    document.querySelector('.recurring-task-button').addEventListener('click', function () {
        if (isClosed) {
            document.querySelector('.chevron-down').style.display = 'none';
            document.querySelector('.chevron-up').style.display = 'block';
            document.querySelector('.recurring-task-outer-container').style.display = 'block';
            fetchRecurringItems();
            isClosed = false;
        } else {
            document.querySelector('.chevron-down').style.display = 'block';
            document.querySelector('.chevron-up').style.display = 'none';
            document.querySelector('.recurring-task-outer-container').style.display = 'none';
            isClosed = true;
        }
    })

    document.querySelector('.create-recurring-task-button').addEventListener('click', function () {
        document.querySelector('.create-recurring-task-button').style.display = 'none';
        document.querySelector('.create-and-edit-recurring-task-container').style.display = 'block';
        document.querySelector('.create-recurring-task-container').style.display = 'block';
        document.querySelector('.edit-recurring-task-container').style.display = 'none';
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
            document.querySelector('.create-recurring-task-container').style.display = 'none';
            document.querySelector('.create-and-edit-recurring-task-container').style.display = 'none';
            document.querySelector('.create-recurring-task-button').style.display = 'block';
            chrome.notifications.create("notificationId", {
                type: "basic",
                iconUrl: "../images/icon-128.png",
                title: extensionTitle,
                message: "Tarefa recorrente adicionada. Será adicionada à lista de tarefas diárias a partir de amanhã"
            });
        }
    })

    document.querySelector('.new-recurring-task .btnCancel').addEventListener('click', function () {
        document.querySelector('.new-recurring-task input').value = '';
        document.querySelector('.create-and-edit-recurring-task-container').style.display = 'none';
        document.querySelector('.create-recurring-task-container').style.display = 'none';
        document.querySelector('.create-recurring-task-button').style.display = 'block';
        chrome.notifications.create("notificationId", {
            type: "basic",
            iconUrl: "../images/icon-128.png",
            title: extensionTitle,
            message: "Criação de tarefa recorrente cancelada"
        });
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
            document.querySelector('.edit-recurring-task-container').style.display = 'none';
            document.querySelector('.create-and-edit-recurring-task-container').style.display = 'none';
            document.querySelector('.create-recurring-task-button').style.display = 'block';
            chrome.notifications.create("notificationId", {
                type: "basic",
                iconUrl: "../images/icon-128.png",
                title: extensionTitle,
                message: "Tarefa recorrente alterada"
            });
        }
    })

    document.querySelector('.edit-recurring-task .btnCancel').addEventListener('click', function () {
        document.querySelector('.edit-recurring-task input').value = '';
        document.querySelector('.edit-recurring-task-container').style.display = 'none';
        document.querySelector('.create-and-edit-recurring-task-container').style.display = 'none';
        document.querySelector('.create-recurring-task-button').style.display = 'block';
        chrome.notifications.create("notificationId", {
            type: "basic",
            iconUrl: "../images/icon-128.png",
            title: extensionTitle,
            message: "Alteração de tarefa recorrente cancelada"
        });
    })

    document.getElementById("currentDate").innerHTML = getCurrentDate();
    fetchItems();
}

document.addEventListener('DOMContentLoaded', initializePopup);
