const puppeteer = require('puppeteer');
const connection = require('./dbConnection.js');
const { scrapePcHouse } = require('./scrapeMonitor.js');

exports.scrapeStartechGPU = async () => {
    var page, photos1, links1, photos2, links2, links, photos, productName, price, specification, type, size, pattern, warranty, description;

    try {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        await page.goto('https://startech.com.bd/component/graphics-card?filter_status=7&sort=p.price&order=ASC&limit=90');

        //Scraping link to the images of products
        photos1 = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-img > a > img', (elements) => {
            return elements.map((element) => element.src);
        })

        //Scraping the links to detailed page of individual products
        links1 = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-details > h4 > a', (elements) => {
            return elements.map((element) => element.href);
        })


        await page.goto('https://www.startech.com.bd/component/graphics-card?filter_status=7&sort=p.price&order=ASC&limit=90&page=2');

        photos2 = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-img > a > img', (elements) => {
            return elements.map((element) => element.src);
        })

        //Scraping the links to detailed page of individual products
        links2 = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-details > h4 > a', (elements) => {
            return elements.map((element) => element.href);
        })

        links = [...links1, ...links2];
        photos = [...photos1, ...photos2];
    }
    catch (error) {
        console.error(error);
        console.log('gpu-startech');
    }

    i = 0;

    for (link of links) {
        try {
            await page.goto(link);

            productName = await page.$$eval('#product > div > div.product-short-info > h1', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.replace(/\n/g, '');
                });
            });

            if (productName == 'AFOX Radeon RX 550 4GB GDDR5 Dual Fan Graphics Card') {
                continue;
            }

            price = await page.$$eval('#product > div > div.product-short-info > table > tbody > tr:nth-child(n) > td.product-info-data.product-regular-price', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    temp = element.textContent.replace(/\n/g, '');
                    temp = temp.replace(/,/g, '').replace('৳', '');
                    return parseInt(temp);
                });
            });

            specification = await page.$$eval('#specification > table', (elements) => {
                return elements.map(element => element.textContent.trim());
            })

            if (specification[0].includes('GDDR5')) {
                type = 'GDDR5';
            }
            else if (specification[0].includes('GDDR6')) {
                type = 'GDDR6';
            } else if (specification[0].includes('GDDR6x')) {
                type = 'GDDR6x';
            } else {
                i++;
                continue;
            }

            let specificationText = specification[0].toLowerCase();
            const sizePatterns = [
                /24\s*gb/i,
                /20\s*gb/i,
                /16\s*gb/i,
                /12\s*gb/i,
                /10\s*gb/i,
                /8\s*gb/i,
                /6\s*gb/i,
                /4\s*gb/i
            ];


            // Loop through the size patterns and check if any pattern matches the specification text
            for (const pattern of sizePatterns) {
                if (pattern.test(specificationText)) {
                    // Extract the matched size value from the specification text
                    const match = specificationText.match(pattern);
                    // Parse the matched value to an integer and assign it to the size variable
                    size = parseInt(match[0], 10);
                    // Break the loop since we found a matching pattern
                    break;
                }
            }

            // Check if size is still undefined, you can set a default value if needed
            if (size === undefined) {
                // Default size value (e.g., 0 or any other appropriate default value)
                i++;
                continue;
            }

            warranty = specification[0].substr(specification[0].indexOf('Manufacturing Warranty') + 22, 2);
            warranty = parseInt(warranty);
            if (isNaN(warranty))
                warranty = 3;

            description = await page.$$eval('#description > div.full-description', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.trim();
                });
            })

            if(description==[])
            {
                i++;
                continue;
            }

            try {
                await connection.execute('delete from gpu_shop where productName=? and shop=?', [productName[0], 'Startech']);
            } catch (error) {
                console.error(error);
            }

            try {
                [rows] = await connection.execute('select * from gpu_details where productName=?', [productName[0]]) || [];
                if (rows[0] == undefined) {
                    await connection.execute('insert into gpu_details values(?,?,?,?,?)', [productName[0], type, size, photos[i++], description[0]]);
                }
            } catch (error) {
                console.error(error);
            }

            try {
                await connection.execute('insert into gpu_shop values (?,?,?,?,?)', [productName[0], price[0], warranty, 'Startech', link]);
            } catch (error) {
                console.error(error);
            }
        }
        catch (error) {
            console.error(error);
            console.log('gpu-startech');
            i++;
        }
    }
    console.log('Sdone');
    browser.close();
}


exports.scrapeTechlandGPU = async () => {
    var page, photos1, links1, photos2, links2, links, photos, productName, price, specification, type, size, pattern, warranty, description;

    try {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        await page.goto('https://www.techlandbd.com/pc-components/graphics-card?sort=p.price&order=ASC&limit=100&fq=1');

        //Scraping link to the images of products
        photos1 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map((element) => element.src);
        })

        //Scraping the links to detailed page of individual products
        links1 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (elements) => {
            return elements.map((element) => element.href);
        })

        await page.goto('https://www.techlandbd.com/pc-components/graphics-card?sort=p.price&order=ASC&limit=100&fq=1&page=2');

        photos2 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map((element) => element.src);
        })

        //Scraping the links to detailed page of individual products
        links2 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (elements) => {
            return elements.map((element) => element.href);
        })

        links = [...links1, ...links2];
        photos = [...photos1, ...photos2];
    }
    catch (error) {
        console.error(error);
        console.log('gpu-techland');
    }

    i = 0;

    for (link of links) {
        try {
            await page.goto(link);

            productName = await page.$$eval('#product > table > caption > div', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent;//.replace(/\n/g, '');
                });
            });



            price = await page.$$eval('#product > table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(2)', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    temp = element.textContent.replace(/\n/g, '');
                    temp = temp.replace(/,/g, '').replace('৳', '');
                    return parseInt(temp);
                });
            });

            priceType = await page.$$eval('#product > table > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(1)', (elements) => {
                return elements.map((element) => {
                    return element.textContent;
                })
            });

            if (priceType[0] == 'special price') {
                price = await page.$$eval('#product > table > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(2)', (elements) => {
                    return elements.map((element) => {
                        // Use String.replace() to remove newline characters
                        temp = element.textContent.replace(/\n/g, '');
                        temp = temp.replace(/,/g, '').replace('৳', '');
                        return parseInt(temp);
                    });
                });
            }

            specification = await page.$$eval('#tab-specification > div > table > tbody', (elements) => {
                return elements.map(element => element.textContent.trim());
            })

            if (specification.length == 0) {
                i++;
                continue;
            }

            if (!specification[0].includes('Memory Type')) {
                i++;
                continue;
            }

            if (specification[0].includes('GDDR5')) {
                type = 'GDDR5';
            }
            else if (specification[0].includes('GDDR6')) {
                type = 'GDDR6';
            } else if (specification[0].includes('GDDR6x')) {
                type = 'GDDR6x';
            } else {
                i++;
                continue;
            }


            let specificationText = specification[0].toLowerCase();
            const sizePatterns = [
                /24\s*gb/i,
                /20\s*gb/i,
                /16\s*gb/i,
                /12\s*gb/i,
                /10\s*gb/i,
                /8\s*gb/i,
                /6\s*gb/i,
                /4\s*gb/i
            ];


            // Loop through the size patterns and check if any pattern matches the specification text
            for (const pattern of sizePatterns) {
                if (pattern.test(specificationText)) {
                    // Extract the matched size value from the specification text
                    const match = specificationText.match(pattern);
                    // Parse the matched value to an integer and assign it to the size variable
                    size = parseInt(match[0], 10);
                    // Break the loop since we found a matching pattern
                    break;
                }
            }

            // Check if size is still undefined, you can set a default value if needed
            if (size === undefined) {
                // Default size value (e.g., 0 or any other appropriate default value)
                i++;
                continue;
            }

            warranty = specification[0].substr(specification[0].indexOf('Warranty') + 9, 5);
            warranty = parseInt(warranty);
            if (isNaN(warranty))
                warranty = 3;

            description = await page.$$eval('#blocks-1-tab-2 > div', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.trim();
                });
            })

            if(description==[])
            {
                i++;
                continue;
            }

            try {
                await connection.execute('delete from gpu_shop where productName=? and shop=?', [productName[0], 'Techland']);
            } catch (error) {
                console.error(error);
            }

            try {
                [rows] = await connection.execute('select * from gpu_details where productName=?', [productName[0]]) || [];
                if (rows[0] == undefined) {
                    await connection.execute('insert into gpu_details values(?,?,?,?,?)', [productName[0], type, size, photos[i++], description[0]]);
                }
            } catch (error) {
                console.error(error);
            }

            try {
                await connection.execute('insert into gpu_shop values (?,?,?,?,?)', [productName[0], price[0], warranty, 'Techland', link]);
            } catch (error) {
                console.error(error);
            }
        }
        catch (error) {
            console.error(error);
            console.log('gpu-techland');
            i++;
        }
    }
    console.log('tdone');
    browser.close();
}


exports.scrapePcHouseGPU = async () => {
    var page, photos1, links1, photos2, links2, links, photos, productName, price, specification, type, size, pattern, warranty, description;

    try {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        await page.goto('https://www.pchouse.com.bd/graphics-card?sort=pd.name&order=ASC&fq=1&limit=100');

        //Scraping link to the images of products
        photos1 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map((element) => element.src);
        })

        //Scraping the links to detailed page of individual products
        links1 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (elements) => {
            return elements.map((element) => element.href);
        })

        await page.goto('https://www.pchouse.com.bd/graphics-card?sort=pd.name&order=ASC&fq=1&limit=100&page=2');

        //Scraping link to the images of products
        photos2 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map((element) => element.src);
        })

        //Scraping the links to detailed page of individual products
        links2 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (elements) => {
            return elements.map((element) => element.href);
        })

        links = [...links1, ...links2];
        photos = [...photos1, ...photos2];

    }
    catch (error) {
        console.error(error);
        console.log('gpu-pchouse');
    }

    i = 0;

    for (link of links) {
        try {
            await page.goto(link);

            productName = await page.$$eval('#product > div.title.page-title', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.replace(/\n/g, '');
                });
            });

            price = await page.$$eval('#product > div.product-price-group > div.price-wrapper > div.price-group > div > div > div > div.module-item.module-item-1.no-expand > div > div.block-header > span > div', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    temp = element.textContent.replace(/\n/g, '');
                    temp = temp.replace(/,/g, '').replace('৳', '');
                    return parseInt(temp);
                });
            });



            specification = await page.$$eval('#tab-specification > div > table', (elements) => {
                return elements.map(element => element.textContent.trim());
            })

            if (specification.length == 0) {
                //i++;
                continue;
            }

            type;
            if (specification[0].includes('GDDR5')) {
                type = 'GDDR5';
            }
            else if (specification[0].includes('GDDR6')) {
                type = 'GDDR6';
            } else if (specification[0].includes('GDDR6x')) {
                type = 'GDDR6x';
            } else {
                i++;
                continue;
            }

            let specificationText = specification[0].toLowerCase();
            const sizePatterns = [
                /24\s*gb/i,
                /20\s*gb/i,
                /16\s*gb/i,
                /12\s*gb/i,
                /10\s*gb/i,
                /8\s*gb/i,
                /6\s*gb/i,
                /4\s*gb/i
            ];


            // Loop through the size patterns and check if any pattern matches the specification text
            for (const pattern of sizePatterns) {
                if (pattern.test(specificationText)) {
                    // Extract the matched size value from the specification text
                    const match = specificationText.match(pattern);
                    // Parse the matched value to an integer and assign it to the size variable
                    size = parseInt(match[0], 10);
                    // Break the loop since we found a matching pattern
                    break;
                }
            }

            // Check if size is still undefined, you can set a default value if needed
            if (size === undefined) {
                // Default size value (e.g., 0 or any other appropriate default value)
                i++;
                continue;
            }


            warranty;
            if (specification[0].toLowerCase().includes('warranty')) {
                specification[0] = specification[0].replace('Warranty Information', '');
                warranty = specification[0].substr(specification[0].indexOf('Warranty') + 8, 30);
                warranty.replace('0', '');
                warranty = parseInt(warranty);
                if (isNaN(warranty)) {
                    warranty = 3;
                }
            } else {
                warranty = 3;
            }

            description = await page.$$eval('#blocks-6734b5c651a83-tab-2 > div > div > div.block-content.block-description > p:nth-child(2)', (elements)=>{
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.trim();
                });
            })

            if(description==[])
            {
                i++;
                continue;
            }

            // console.log(productName,price,type,size,warranty,description,photos[i]);

            try {
                await connection.execute('delete from gpu_shop where productName=? and shop=?', [productName[0], 'PcHouse']);
            } catch (error) {
                console.error(error);
            }

            try {
                [rows] = await connection.execute('select * from gpu_details where productName=?', [productName[0]]) || [];
                if (rows[0] == undefined) {
                    await connection.execute('insert into gpu_details values(?,?,?,?,?)', [productName[0] || "", type || "", size || 0, photos[i++] || "", description[0] || ""]);
                }
            } catch (error) {
                console.error(error);
            }

            try {
                await connection.execute('insert into gpu_shop values (?,?,?,?,?)', [productName[0], price[0], warranty, 'PcHouse', link]);
            } catch (error) {
                console.error(error);
            }
        }
        catch (error) {
            console.error(error);
            console.log('gpu-pchouse');
            i++;
        }
    }


    console.log('pdone');
    browser.close();
}
