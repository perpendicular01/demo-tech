let puppeteer = require('puppeteer');
let Monitor = require('../classes/monitor');
const connection = require('./dbConnection.js');

const fs = require('fs');
const path = require('path');

const defaultImagePath = path.join(__dirname, 'monitor.jpeg');
const defaultImageBuffer = fs.readFileSync(defaultImagePath);

exports.scrapeStartechMoni = async () => {
    var browser, page, links1, photos1, links2, photos2, links, photos, specification, productName, price, resolution, resolutionMatch, displaySize, panelType, numericValues, warranty, description;

    try {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.startech.com.bd/monitor?filter_status=7&limit=90');

        links1 = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-details > h4 > a', (links) => {
            return links.map(x => x.href);
        })

        photos1 = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-img > a > img', (elements) => {
            return elements.map(element => element.src);
        })

        await page.goto('https://www.startech.com.bd/monitor?filter_status=7&limit=90&page=2');

        links2 = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-details > h4 > a', (links) => {
            return links.map(x => x.href);
        })

        photos2 = await page.$$eval('#content > div.main-content.p-items-wrap > div:nth-child(n) > div > div.p-item-img > a > img', (elements) => {
            return elements.map(element => element.src);
        })

        links = [...links1, ...links2];
        photos = [...photos1, ...photos2];
    }
    catch (error) {
        console.error(error);
        console.log('monitor-startech');
    }

    i = 0;
    for (link of links) {
        try {
            await page.goto(link);

            specification = await page.$$eval('#specification > table', (elements) => {
                return elements.map(x => x.textContent.trim());
            })

            //console.log(specification);

            productName = await page.$$eval('#product > div > div.product-short-info > h1', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.replace(/\n/g, '');
                });
            });

            price = await page.$$eval('#product > div > div.product-short-info > table > tbody > tr:nth-child(2) > td.product-info-data.product-regular-price', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    temp = element.textContent.replace(/\n/g, '');
                    temp = temp.replace(/,/g, '').replace('৳', '');
                    return parseInt(temp);
                });
            });


            resolution;
            resolutionMatch = specification[0].match(/(?:1920x1080|1920\s*X\s*1080|3840x2160|3840\s*X\s*2160|2560x1440|2560\s*X\s*1440)/i);

            if (resolutionMatch) {
                resolution = resolutionMatch[0]; // Extract the matched resolution value
                resolution = resolution.replace(/\s+/g, ''); // Remove spaces in the matched resolution value
                resolution = resolution.replace('X', 'x');

            } else {
                i++;
                continue;
            }


            displaySize
            displaySize = specification[0].substr(specification[0].indexOf('Display Size') + 11, 15);

            // Use regular expression to extract numeric values from the string
            numericValues = displaySize.match(/\d+(\.\d+)?/g);

            // If there are numeric values, you can use them as needed
            if (numericValues) {
                // numericValues is an array containing the extracted numeric values
                displaySize = parseFloat(numericValues) // Output: [ '15.6' ] (for example)
            } else {
                displaySize = specification[0].substr(specification[0].indexOf('Panel Size') + 11, 15);
                numericValues = displaySize.match(/\d+(\.\d+)?/g);

                // If there are numeric values, you can use them as needed
                if (numericValues) {
                    // numericValues is an array containing the extracted numeric values
                    displaySize = parseFloat(numericValues) // Output: [ '15.6' ] (for example)
                } else {
                    i++;
                    continue;
                }
            }

            if (displaySize > 50) {
                i++;
                continue;
            }

            panelType;
            let specificationText = specification[0].toLowerCase();
            if (/ips\b/i.test(specificationText)) {
                panelType = 'IPS';
            } else if (/va\b/i.test(specificationText)) {
                panelType = 'VA';
            } else if (/tn\b/i.test(specificationText)) {
                panelType = 'TN';
            } else if (/oled\b/i.test(specificationText)) {
                panelType = 'OLED';
            } else {
                panelType = 'Unmentioned'; // Assign 'Unmentioned' if none of the panel types are specified
            }


            specification[0] = specification[0].replace('Warranty Information', '');
            warranty = specification[0].substr(specification[0].indexOf('Warranty') + 8, 3);
            // warranty.replace('0', '');
            warranty = parseInt(warranty);
            if (isNaN(warranty))
                warranty = 3;

            description = await page.$$eval('#description > div.full-description > p:nth-child(2)', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.trim();
                });
            });

            if (description == undefined) {
                i++;
                continue;
            }
            
            try {
                await connection.execute('delete from monitor_shop where productName=? and shop=?', [productName[0], 'Startech']);
            } catch (error) {
                console.error(error);
            }

            try {
                const [rows] = await connection.execute('select * from monitor_details where productName=?', [productName[0]] || []);

                if (rows[0] == undefined) {
                    await connection.execute('INSERT INTO monitor_details (productName, resolution, displaySize, panelType, image, description) VALUES (?, ?, ?, ?,?,?)', [productName[0], resolution, displaySize, panelType, photos[i++], description[0]]);
                }
            } catch (error) {
                console.error(error);
            }

            try {
                await connection.execute('INSERT INTO monitor_shop (productName, price, shop, link, warranty) VALUES (?, ?, ?, ?, ?)', [productName[0] || "", price[0] || 45000, 'Startech', link || "", warranty || 0]);
            } catch (error) {
                console.error(error);
            }
        }
        catch (error) {
            console.error(error);
            console.log('monitor-startech');
            i++;
        }
    }

    console.log('Sdone');
    browser.close();
}





exports.scrapeTechlandMoni = async () => {
    var link, browser, page, links1, links3, photos3, photos1, links2, photos2, links, photos, specification, productName, price, resolution, resolutionMatch, displaySize, panelType, numericValues, warranty, description;

    try {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.techlandbd.com/monitor-and-display/computer-monitor?fq=1&limit=100');


        links1 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (links) => {
            return links.map(x => x.href);
        })


        photos1 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map(element => element.src);
        })

        await page.goto('https://www.techlandbd.com/monitor-and-display/computer-monitor?fq=1&limit=100&page=2');

        links2 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (links) => {
            return links.map(x => x.href);
        })


        photos2 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map(element => element.src);
        })

        await page.goto('https://www.techlandbd.com/monitor-and-display/computer-monitor?fq=1&limit=100&page=3');
        links3 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (links) => {
            return links.map(x => x.href);
        })


        photos3 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map(element => element.src);
        })

        links = [...links1, ...links2, ...links3];
        photos = [...photos1, ...photos2, ...photos3];

    }
    catch (error) {
        console.error(error);
        console.log('monitor-techland');
    }

    //Contains src of the images

    i = 0;
    console.log("hello");
    for (link of links) {
        try {
            await page.goto(link);

            specification = await page.$$eval('#tab-specification > div > table > tbody', (elements) => {
                return elements.map(x => x.textContent.trim());
            })

            if (specification.length <= 0) {
                specification = await page.$$eval('#blocks--tab-1 > div > div > div > table > tbody', (elements) => {
                    return elements.map(x => x.textContent.trim());
                })
            }

            if (specification.length <= 0) {
                specification = await page.$$eval('#blocks--tab-1 > div > div > div > table:nth-child(2) > tbody', (elements) => {
                    return elements.map(x => x.textContent.trim());
                })
            }

            if (specification.length <= 0) {
                i++;
                continue;
            }

            productName = await page.$$eval('#product > table > caption > div > h1', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.replace(/\n/g, '');
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

            if (isNaN(price) || price == undefined) {

                i++;

                continue;
            }

            // priceType = await page.$$eval('#product > table > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(1)', (elements) => {
            //     return elements.map((element) => {
            //         return element.textContent;
            //     })
            // });

            // if (priceType[0] == 'special price') {
            //     price = await page.$$eval('#product > table > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(2)', (elements) => {
            //         return elements.map((element) => {
            //             // Use String.replace() to remove newline characters
            //             temp = element.textContent.replace(/\n/g, '');
            //             temp = temp.replace(/,/g, '').replace('৳', '');
            //             return parseInt(temp);
            //         });
            //     });
            // }


            // Assuming specification[0] contains the specifications string
            resolution;
            resolutionMatch = specification[0].match(/(?:1920x1080|1920\s*X\s*1080|3840x2160|3840\s*X\s*2160|2560x1440|2560\s*X\s*1440)/i);
            if (resolutionMatch) {
                resolution = resolutionMatch[0]; // Extract the matched resolution value
                resolution = resolution.replace(/\s+/g, ''); // Remove spaces in the matched resolution value
                resolution = resolution.replace('X', 'x');

            } else {
                i++;
                continue;
            }




            // Assuming `specification` is an array containing display information as strings
            let displaySize = '';
            if (specification[0] && specification[0].includes('Screen Size')) {
                // Extract substring starting right after 'Screen Size'
                displaySize = specification[0].substr(specification[0].indexOf('Screen Size') + 11, 50);

                // Use regular expression to find numeric values in the extracted substring
                const numericValues = displaySize.match(/\d+(\.\d+)?/);

                // Check if we successfully extracted a numeric value
                if (numericValues) {
                    displaySize = parseFloat(numericValues[0]); // Convert to float
                } else {
                    displaySize = 32;
                }
               
                if(displaySize === 0){
                    displaySize = 27;
                }
            } 

            




            panelType;
            let specificationText = specification[0].toLowerCase();

            if (/ips\b/i.test(specificationText)) {
                panelType = 'IPS';
            } else if (/va\b/i.test(specificationText)) {
                panelType = 'VA';
            } else if (/tn\b/i.test(specificationText)) {
                panelType = 'TN';
            } else if (/oled\b/i.test(specificationText)) {
                panelType = 'OLED';
            } else {
                panelType = 'Unmentioned'; // Assign 'Unmentioned' if none of the panel types are specified
            }



            warranty = 3;
            // if (specification[0].toLowerCase().includes('warranty')) {
            //     warranty = specification[0].substr(specification[0].indexOf('Warranty') + 8, 5);
            //     warranty.replace('0', '');
            //     warranty = parseInt(warranty);
            //     if (isNaN(warranty))
            //         warranty = 3;
            // } else {
            //     i++;
            //     continue;
            // }


            description = await page.$$eval('#blocks-1-tab-2 > div > div > div', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.trim();
                });
            });

            if (description == undefined) {
                i++;
                continue;
            }


            try {
                await connection.execute('delete from monitor_shop where productName=? and shop=?', [productName[0], 'Techland']);
            } catch (error) {
                console.error(error);
            }


            try {
                const [rows] = await connection.execute('select * from monitor_details where productName=?', [productName[0]]) || [];
                if (rows[0] == undefined) {
                    await connection.execute('INSERT INTO monitor_details (productName, resolution, displaySize, panelType,image,description) VALUES (?, ?, ?, ?, ?, ?)', [productName[0] || "", resolution || "", displaySize || 0, panelType || "", photos[i++] || defaultImageBuffer, description[0] || ""]);
                }
            } catch (error) {

                console.error(error);
            }

            try {

                await connection.execute('INSERT INTO monitor_shop (productName, price, shop, link, warranty) VALUES (?, ?, ?, ?, ?)', [productName[0] || "o", price[0] || 0, 'Techland', link || "FF", warranty || 2]);
            } catch (error) {

                console.error(error);
            }
        }
        catch (error) {

            console.error(error);
            console.log('monitor-techland');
            i++;
        }

    }
    console.log('Tdone');
    browser.close();
}



exports.scrapePcHouseMoni = async () => {
    var browser, page, links1, photos1, links2, photos2, links, photos, specification, productName, price, resolution, resolutionMatch, displaySize, panelType, numericValues, warranty, description;

    try {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://www.pchouse.com.bd/monitor?sort=p.sort_order&order=ASC&fq=1&limit=100');


        links1 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (links) => {
            return links.map(x => x.href);
        })


        photos1 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map(element => element.src);
        })

        await page.goto('https://www.pchouse.com.bd/monitor?sort=p.sort_order&order=ASC&fq=1&limit=100&page=2');

        links2 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (links) => {
            return links.map(x => x.href);
        })


        photos2 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map(element => element.src);
        })

        await page.goto('https://www.pchouse.com.bd/monitor?sort=p.sort_order&order=ASC&fq=1&limit=100&page=3');
        links3 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a', (links) => {
            return links.map(x => x.href);
        })


        photos3 = await page.$$eval('#content > div.main-products-wrapper > div.main-products.product-grid > div:nth-child(n) > div > div.image > a > div > img', (elements) => {
            return elements.map(element => element.src);
        })

        links = [...links1, ...links2, ...links3];
        photos = [...photos1, ...photos2, ...photos3];
    }
    catch (error) {
        console.error(error);
        console.log('monitor-pchouse');
    }

    //Contains src of the images

    i = 0;
    for (link of links) {
        try {
            await page.goto(link);

            specification = await page.$$eval('#tab-specification > div > table', (elements) => {
                return elements.map(x => x.textContent.trim());
            })

            if (specification.length <= 0) {
                specification = await page.$$eval('#blocks--tab-1 > div > div > div > table > tbody', (elements) => {
                    return elements.map(x => x.textContent.trim());
                })
            }

            if (specification.length <= 0) {
                specification = await page.$$eval('#blocks--tab-1 > div > div > div > table:nth-child(2) > tbody', (elements) => {
                    return elements.map(x => x.textContent.trim());
                })
            }

            if (specification.length <= 0) {
                i++;
                continue;
            }

            //console.log(specification[0]);

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
            if (isNaN(price) || price == undefined) {
                i++;
                continue;
            }



            //Assuming specification[0] contains the specifications string
            resolution;
            resolutionMatch = specification[0].match(/(?:1920x1080|1920\s*X\s*1080|3840x2160|3840\s*X\s*2160|2560x1440|2560\s*X\s*1440)/i);
            if (resolutionMatch) {
                resolution = resolutionMatch[0]; // Extract the matched resolution value
                resolution = resolution.replace(/\s+/g, ''); // Remove spaces in the matched resolution value
                resolution = resolution.replace('X', 'x');
            } else {
                i++;
                continue;
            }


            displaySize;
            displaySize = specification[0].substr(specification[0].indexOf('Display Size') + 11, 50);

            // Use regular expression to extract numeric values from the string
            numericValues = displaySize.match(/\d+(\.\d+)?/g);

            // If there are numeric values, you can use them as needed
            if (numericValues) {
                // numericValues is an array containing the extracted numeric values
                displaySize = parseFloat(numericValues) // Output: [ '15.6' ] (for example)
            } else {
                displaySize = specification[0].substr(specification[0].indexOf('Screen Size') + 11, 50);
                numericValues = displaySize.match(/\d+(\.\d+)?/g);

                // If there are numeric values, you can use them as needed
                if (numericValues) {
                    // numericValues is an array containing the extracted numeric values
                    displaySize = parseFloat(numericValues) // Output: [ '15.6' ] (for example)
                } else {
                    i++;
                    continue;
                }
            }

            if (displaySize > 50) {
                i++;
                continue;
            }



            panelType;
            let specificationText = specification[0].toLowerCase();
            if (/ips\b/i.test(specificationText)) {
                panelType = 'IPS';
            } else if (/va\b/i.test(specificationText)) {
                panelType = 'VA';
            } else if (/tn\b/i.test(specificationText)) {
                panelType = 'TN';
            } else if (/oled\b/i.test(specificationText)) {
                panelType = 'OLED';
            } else {
                panelType = 'Unmentioned'; // Assign 'Unmentioned' if none of the panel types are specified
            }


            warranty;
            specification[0] = specification[0].replace('Warranty Information', '');
            warranty = specification[0].substr(specification[0].indexOf('Warranty') + 8, 30);
            warranty.replace('0', '');
            warranty = parseInt(warranty);
            if (isNaN(warranty))
                warranty = 3;


            description = await page.$$eval('#blocks-67326f83b2271-tab-2 > div > div > div.block-content.block-description', (elements) => {
                return elements.map((element) => {
                    // Use String.replace() to remove newline characters
                    return element.textContent.trim();
                });
            });

            if (description == undefined) {
                i++;
                continue;
            }


            try {
                await connection.execute('delete from monitor_shop where productName=? and shop=?', [productName[0], 'PcHouse']);
            } catch (error) {
                console.error(error);
            }


            try {
                const [rows] = await connection.execute('select * from monitor_details where productName=?', [productName[0]]) || [];
                if (rows[0] == undefined) {

                    await connection.execute('INSERT INTO monitor_details (productName, resolution, displaySize, panelType, image, description) VALUES (?, ?, ?, ?, ?, ?)', [productName[0] || "", resolution || "", displaySize || 0, panelType || "", photos[i++] || "", description[0] || ""]);
                }
            } catch (error) {
                console.error(error);
            }

            try {
                await connection.execute('INSERT INTO monitor_shop (productName, price, shop, link, warranty) VALUES (?, ?, ?, ?, ?)', [productName[0], price[0], 'PcHouse', link, warranty]);
            } catch (error) {
                console.error(error);
            }
        }
        catch (error) {
            console.error(error);
            console.log('monitor-pcHouse');
            i++;
        }

    }
    console.log('Pdone');
    browser.close();
}








