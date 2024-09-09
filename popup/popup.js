const items = [{ "item": "Record next video", "status": 0 },
{ "item": "Record another video", "status": 1 },]

const itemsStr = JSON.stringify(items);

console.log(items)
console.log(itemsStr)

document.querySelector('.create-task').addEventListener('click', function() {
    document.querySelector('.new-task').style.display='block';
})

document.querySelector('.new-task button').addEventListener('click', function() {
    var itemName = document.querySelector('.new-task input').value;

    if(itemName != ''){

        var itemsStorage = localStorage.getItem('todo-items');
        var itemsArr = JSON.parse(itemsStorage);
    
        itemsArr.push({"item": itemName, "status": 0});
    
        saveItems(itemsArr);
        fetchItems();
        document.querySelector('.new-task input').value='';
        document.querySelector('.new-task').style.display='none';
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
            if(itemsArr[i].status == 1) {
                status= 'class="done"';
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

        var itemsListUL = document.querySelectorAll('ul li');
        for (var i = 0; i < itemsListUL.length; i++){
            itemsListUL[i].querySelector('.itemComplete').addEventListener('click', function() {
                var index = this.parentNode.parentNode.dataset.itemindex;
                itemComplete(index);
            });
            itemsListUL[i].querySelector('.itemDelete').addEventListener('click', function() {
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

    document.querySelector('ul.todo-items li[data-itemindex="'+index+'"]').className='done';

}

function itemDelete(index){
    var itemsStorage = localStorage.getItem('todo-items');
    var itemsArr = JSON.parse(itemsStorage);

    itemsArr.splice(index, 1);  

    saveItems(itemsArr);

    document.querySelector('ul.todo-items li[data-itemindex="'+index+'"]').remove();
}

function saveItems(obj) {
    var string = JSON.stringify(obj);
    localStorage.setItem('todo-items', string);

}

fetchItems();