// scrapeAndSum.mjs
import { chromium } from 'playwright';

const seeds = Array.from({ length: 10 }, (_, i) => 45 + i);
const baseUrl = 'https://sanand0.github.io/tdsdata/js_table/?seed='; // Replace with the actual base URL

let grandTotal = 0;

const browser = await chromium.launch();
const page = await browser.newPage();

for (const seed of seeds) {
    const url = `${baseUrl}${seed}`;
    console.log(`Visiting ${url}`);
    await page.goto(url);

    const tableData = await page.$$eval('table', tables => {
        let sum = 0;
        tables.forEach(table => {
            table.querySelectorAll('td').forEach(cell => {
                const num = parseFloat(cell.textContent.replace(/[^0-9.-]+/g, ''));
                if (!isNaN(num)) sum += num;
            });
        });
        return sum;
    });

    console.log(`Seed ${seed} subtotal: ${tableData}`);
    grandTotal += tableData;
}

await browser.close();
console.log(`✅ Grand Total: ${grandTotal}`);
