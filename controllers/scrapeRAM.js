const puppeteer = require('puppeteer');
const connection = require('./dbConnection.js');


exports.scrapeStartech = async () => {
    const browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto('https://www.startech.com.bd/component/ram?filter_status=7&sort=p.price&order=ASC&limit=90&page=1');

    //Scraping link to the images of products
    const photos = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-img > a >img', (elements) => {
        return elements.map((element) => element.src);
    })
    //Scraping the links to detailed page of individual products
    const links = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-details > h4 > a', (elements) => {
        return elements.map((element) => element.href);
    })

    let i = 0;
    let warranty='LIFETIME';

    for (link of links) {
        await page.goto(link);

        let productName = await page.$$eval('#product > div > div.product-short-info > h1', (elements) => {
            return elements.map((element) => {
                // Use String.replace() to remove newline characters
                return element.textContent.replace(/\n/g, '');
            });
        });

        let price = await page.$$eval('#product > div > div.product-price-options > label.p-wrap.cash-payment.active > span', (elements) => {
            return elements.map((element) => {
                // Use String.replace() to remove newline characters
                let temp = element.textContent.replace(/\n/g, '');
                temp = temp.replace(/,/g, '').replace('৳', '');
                return parseInt(temp);
            });
        });

        let specification = await page.$$eval('#specification > table', (elements) => {
            return elements.map(element => element.textContent.trim());
        })

        if (specification[0] == undefined)
            continue;

        let type = specification[0].substr(specification[0].indexOf('DDR'), 4);
        if(type=='e')
            type='DDR4';
        
        let capacity=specification[0].substr(specification[0].indexOf('Capacity')+8,14);
        capacity=parseInt(capacity.replace('Memory Size ',''));

        let frequency=specification[0].substr(specification[0].indexOf('Frequency')+9,4);
        frequency=parseInt(frequency);
        if(isNaN(frequency)){
            frequency=productName[0].substr(productName[0].indexOf('DDR')+5,4);
            frequency=parseInt(frequency);
        }

        let latency=specification[0].substr(specification[0].indexOf('Latency')+7,26);
        latency=latency.replace(/\n/g, ' ');

        try {
            const [rows] = await connection.execute('select * from ram_details where productName=?', [productName[0]]) || [];
            if (rows[0] == undefined) {
                await connection.execute('insert into ram_details values(?,?,?,?,?,?)', [productName[0], type, capacity, frequency, latency, photos[i++]]);
            }
        } catch (error) {
            console.error(error);
        }

        try {
            const [rows] = await connection.execute('select * from ram_shop where productName=?', [productName[0]]) || [];
            if (rows[0] == undefined) {
                await connection.execute('insert into ram_shop values (?,?,?,?,?)', [productName[0], price[0], warranty, 'startech', link]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    browser.close();
}