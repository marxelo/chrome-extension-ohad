// popup.test.js
// Mock the chrome API
global.chrome = {
    notifications: {
        create: jest.fn(),
    },
    action: {
        setBadgeText: jest.fn(),
    },
};

// Mock localStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
});

// Mock DOM elements and methods
document.body.innerHTML = `
    <button class="create-task-btn"></button>
    <div class="create-and-edit-daily-task-container"></div>
    <div class="create-daily-task-container"></div>
    <div class="edit-daily-task-container"></div>
    <ul class="todo-items"></ul>
    <ul class="recurring-todo-items"></ul>
    <div id="currentDate"></div>
`;

// Mock addEventListener for document
document.addEventListener = jest.fn();

// Mock querySelector and querySelectorAll to return elements with addEventListener
// Update the mock for querySelector to include the expected structure and behavior
document.querySelector = jest.fn((selector) => {
    if (selector === '.edit-recurring-task input') {
        return {
            _value: 'Recurring Task edited',
            set value(newValue) {
                this._value = newValue;  // Set the value
            },
            get value() {
                return this._value;  // Retrieve the value
            },
        };
    }
    if (selector === '.edit-daily-task input') {
        return {
            _value: 'Test Task edited',
            set value(newValue) {
                this._value = newValue;  // Set the value
            },
            get value() {
                return this._value;  // Retrieve the value
            },
        };
    }
    return {
        addEventListener: jest.fn(),
        style: {},
        value: '',
    };
});

document.querySelectorAll = jest.fn(() => {
    return [
        {
            querySelector: jest.fn(() => ({
                addEventListener: jest.fn(),
            })),
            parentNode: {
                dataset: {
                    itemindex: '0',
                },
            },
        },
    ];
});

// Import functions to test
const popup = require('./popup-utils');

describe('Popup.js Unit Tests', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Reset all mocks
        jest.clearAllMocks();
    });

    test('saveItems should store items in localStorage', () => {
        const testItems = [{ item: 'Test Task', status: 0 }];
        popup.saveItems(testItems);
        expect(localStorage.setItem).toHaveBeenCalledWith(
            popup.getCurrentDateTime(),
            JSON.stringify(testItems)
        );
    });

    test('fetchItems should retrieve items from localStorage', () => {
        const testItems = [{ item: 'Test Task', status: 0 }];
        localStorage.getItem.mockReturnValue(JSON.stringify(testItems));

        popup.fetchItems();

        expect(document.querySelector).toHaveBeenCalledWith('ul.todo-items');
    });

    test('itemComplete should toggle item status', () => {
        const testItems = [{ item: 'Test Task', status: 0 }];
        localStorage.getItem.mockReturnValue(JSON.stringify(testItems));

        popup.itemComplete(0);

        expect(localStorage.setItem).toHaveBeenCalled();
        const updatedItems = JSON.parse(localStorage.setItem.mock.calls[0][1]);
        expect(updatedItems[0].status).toBe(1);
    });

    test('itemEdit should update the input value and call fetchItems', () => {
        const testItems = [{ item: 'Test Task', status: 0 }];
        localStorage.getItem.mockReturnValue(JSON.stringify(testItems));

        popup.itemEdit(0);

        expect(document.querySelector('.edit-daily-task input').value).toBe('Test Task edited');
        expect(localStorage.getItem).toHaveBeenCalled();
    });

    test('itemDelete should remove the item and update localStorage', () => {
        const testItems = [{ item: 'Test Task', status: 0 }];
        localStorage.getItem.mockReturnValue(JSON.stringify(testItems));

        popup.itemDelete(0);

        const updatedItems = JSON.parse(localStorage.setItem.mock.calls[0][1]);
        expect(updatedItems.length).toBe(0); // The item was deleted
        expect(chrome.notifications.create).toHaveBeenCalled();
    });

    test('fetchRecurringItems should populate the recurring task list', () => {
        const recurringItems = [{ item: 'Recurring Task', status: 0 }];
        localStorage.getItem.mockReturnValue(JSON.stringify(recurringItems));

        popup.fetchRecurringItems();

        expect(document.querySelector).toHaveBeenCalledWith('ul.recurring-todo-items');
    });

    test('recurringItemEdit should set the input value correctly', () => {
        const recurringItems = [{ item: 'Recurring Task', status: 0 }];
        localStorage.getItem.mockReturnValue(JSON.stringify(recurringItems));

        popup.recurringItemEdit(0);

        expect(document.querySelector('.edit-recurring-task input').value).toBe('Recurring Task edited');
    });

    test('recurringItemDelete should remove the recurring task and update localStorage', () => {
        const recurringItems = [{ item: 'Recurring Task', status: 0 }];
        localStorage.getItem.mockReturnValue(JSON.stringify(recurringItems));

        popup.recurringItemDelete(0);

        const updatedItems = JSON.parse(localStorage.setItem.mock.calls[0][1]);
        expect(updatedItems.length).toBe(0); // The recurring item was deleted
        expect(chrome.notifications.create).toHaveBeenCalled();
    });

    test('saveRecurringItems should store recurring items in localStorage', () => {
        const recurringItems = [{ item: 'Recurring Task', status: 0 }];
        popup.saveRecurringItems(recurringItems);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'recurring-todo-items',
            JSON.stringify(recurringItems)
        );
    });

    test('getCurrentDateTime should return formatted date-time string', () => {
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2}/;
        expect(popup.getCurrentDateTime()).toMatch(dateTimeRegex);
    });

    test('getCurrentDate should return formatted date string', () => {
        const dateRegex = /^\d{1,2} de [a-z]+ de \d{4}$/i;
        expect(popup.getCurrentDate()).toMatch(dateRegex);
    });
});
