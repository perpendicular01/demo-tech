const puppeteer = require('puppeteer');
const connection = require('./dbConnection.js');  

exports.scrapeStartech = async () => {
    const browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto('https://www.startech.com.bd/component/processor?limit=60');
    //Scraping link to the images of products
    let photos = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-img > a > img', (elements) => {
        return elements.map((element) => element.src);
    })
    //Scraping the links to detailed page of individual products
    let links = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-details > h4 > a', (elements) => {
        return elements.map((element) => element.href);
    })

    let i=0;

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

        let baseFreq = specification[0].substr(specification[0].indexOf('Base Frequency') + 14, 5);
        baseFreq = parseFloat(baseFreq.replace(/\n/g, ''));
        if (isNaN(baseFreq))
            baseFreq = 3.8;

        let maxFreq = specification[0].substr(specification[0].indexOf('Maximum Turbo Frequency') + 23, 5);
        maxFreq = parseFloat(maxFreq.replace(/\n/g, '').replace('Up to ', ''));
        if (isNaN(maxFreq))
            maxFreq = baseFreq + .2;

        let cores = specification[0].substr(specification[0].indexOf('Cores') + 5, 12);
        cores = parseInt(cores.replace(/\n/g, '').replace('CPU Cores ', ''));
        if (isNaN(cores))
            cores = 8;

        let threads = specification[0].substr(specification[0].indexOf('Threads') + 7, 5);
        thread = parseInt(threads.replace(/\n/g, ''));
        if (isNaN(threads))
            threads = 16;

        let tdp = specification[0].substr(specification[0].indexOf('Default TDP') + 11, 5);
        tdp = parseInt(tdp.replace(/\n/g, ''));
        if (isNaN(tdp))
            tdp = 65;

        let type = specification[0].substr(specification[0].indexOf('Type') + 4, 44);
        let temp1 = '';
        let temp2 = '';
        if (type.includes('DDR4')) {
            temp1 = type.substr(type.indexOf('DDR4'), 4) || '';
        }
        if (type.includes('DDR5')) {
            temp2 = type.substr(type.indexOf('DDR5'), 4) || '';
        }
        type = temp1 + ' ' + temp2;
        if(type==' ')type='DDR4';

        let warranty = specification[0].substr(specification[0].indexOf('Manufacturing Warranty')+22,2);
        warranty=parseInt(warranty);
        if(isNaN(warranty))
            warranty=3;


        try{
            const [rows] = await connection.execute('select * from cpu_details where productName=?', [productName[0]]) || [];
            if(rows[0]==undefined){
            await connection.execute('insert into cpu_details values(?,?,?,?,?,?,?,?)', [productName[0],baseFreq,maxFreq,cores,threads,tdp,type,photos[i++]]);
            }
        }catch(error){}

        try{
            const [rows] = await connection.execute('select * from cpu_shop where productName=?', [productName[0]]) || [];
            if(rows[0]==undefined){
            await connection.execute('insert into cpu_shop values (?,?,?,?,?)',[productName[0],price[0],warranty,'startech',link]);
            }
        }catch(error){}
    }

    browser.close();
}