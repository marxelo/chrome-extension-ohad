/**
 * @jest-environment node
 */

const puppeteer = require('puppeteer');
const path = require('path');

const extensionPath = path.resolve(__dirname, '../../'); // Adjust the path to your extension directory

let browser;
let page;
let extensionId;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false, // Set to true for headless mode
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
        ],
    });

    // Open a new page
    page = await browser.newPage();

    // Mock chrome APIs
    await page.evaluateOnNewDocument(() => {
        window.chrome = {
            notifications: {
                create: function (id, options, callback) {
                    console.log(`Notification ${id} created with options`, options);
                    if (callback) callback();
                },
            },
            action: {
                setBadgeText: function ({ text }, callback) {
                    console.log(`Badge text set to ${text}`);
                    if (callback) callback();
                },
            },
        };
    });

    // Wait for the extension's background page or service worker to load
    const extensionTarget = await browser.waitForTarget(
        (target) =>
            (target.type() === 'service_worker' || target.type() === 'background_page') &&
            target.url().startsWith('chrome-extension://'),
        { timeout: 5000 }
    );

    if (!extensionTarget) {
        throw new Error('Extension target not found');
    }

    const extensionUrl = extensionTarget.url();
    const extensionIdMatch = extensionUrl.match(/^chrome-extension:\/\/([a-z]{32})/);
    if (extensionIdMatch) {
        extensionId = extensionIdMatch[1];
    } else {
        throw new Error('Could not extract extension ID');
    }

    // Open the extension's popup page
    const extensionPopupHtml = `chrome-extension://${extensionId}/src/popup/popup.html`;
    await page.goto(extensionPopupHtml);
});

afterAll(async () => {
    await browser.close();
});

beforeEach(async () => {
    // Clear localStorage
    await page.evaluate(() => {
        localStorage.clear();
    });
});

// ... rest of your tests


describe('Chrome Extension Integration Tests', () => {
    test('Displays the correct extension title', async () => {
        const title = await page.$eval('.extension-title', (el) => el.textContent);
        expect(title).toBe('OHAD');
    });


});
