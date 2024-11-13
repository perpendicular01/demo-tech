const connection = require('./dbConnection.js');

exports.filterMonitor = async (req, res) => {
    var below20 = 0, _20to25 = 0, above25 = 0;
    req.body.minRange = parseInt(req.body.minRange);
    req.body.maxRange = parseInt(req.body.maxRange);
    console.log(req.body);
    if (req.body.panelTypes.length == 0) {
        req.body.panelTypes = ['IPS', 'VA', 'TN', 'OLED'];
    }
    if (req.body.displaySizes.length == 0) {
        req.body.displaySizes = ['Below 20', '20 to 25', 'Above 25'];
    }
    if (req.body.resolutions.length == 0) {
        req.body.resolutions = ['1920x1080', '2560x1440', '3840x2160'];
    }

    for (size of req.body.displaySizes) {
        if (size == "Below 20")
            below20 = 1;
        if (size == "20 to 25")
            _20to25 = 1;
        if (size == "Above 25")
            above25 = 1;
    }


    try {
        try {
            var [rows1] = await connection.query('SELECT * FROM monitor_shop ms JOIN monitor_details md ON md.productName = ms.productName WHERE ms.price BETWEEN ? AND ?'
                , [req.body.minRange, req.body.maxRange]);
        } catch (error) {
            console.error(error);
        }
        try {
            var [rows2] = await connection.query('SELECT * FROM monitor_shop ms JOIN monitor_details md ON md.productName = ms.productName WHERE md.panelType IN (?)'
                , [req.body.panelTypes]);
        } catch (error) {
            console.error(error);
        }
        try {
            var [rows3] = await connection.query('SELECT * FROM monitor_shop ms JOIN monitor_details md ON md.productName = ms.productName WHERE (displaySize < 20 AND ? = 1) OR (displaySize >= 20 AND displaySize <= 25 AND ? = 1) OR (displaySize > 25 AND ? = 1)'
                , [below20, _20to25, above25]);
        } catch (error) {
            console.error(error);
        }
        try {
            var [rows4] = await connection.query('SELECT * FROM monitor_shop ms JOIN monitor_details md ON md.productName = ms.productName WHERE md.resolution IN (?)'
                , [req.body.resolutions]);
        } catch (error) {
            console.error(error);
        }
        const commonRows = rows1.filter(row1 =>
            rows2.some(row2 => row1.productName === row2.productName) &&
            rows3.some(row3 => row1.productName === row3.productName) &&
            rows4.some(row4 => row1.productName === row4.productName)
        );
        res.json({ success: true, monitors: commonRows });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
}

exports.filterGPU = async (req, res) => {
    req.body.minRange = parseInt(req.body.minRange);
    req.body.maxRange = parseInt(req.body.maxRange);
    for (size in req.body.size) {
        size = parseInt(size);
    }

    if (req.body.size.length == 0) {
        req.body.size = [8, 10, 12, 16, 20, 24];
    }
    if (req.body.type.length == 0) {
        req.body.type = ['GDDR5', 'GDDR5X', 'GDDR6', 'GDDR6X'];
    }

    console.log(req.body);

    try {
        try {
            var [rows1] = await connection.query('SELECT * FROM gpu_shop gs JOIN gpu_details gd ON gd.productName = gs.productName WHERE gs.price BETWEEN ? AND ?'
                , [req.body.minRange, req.body.maxRange]);
        } catch (error) {
            console.error(error);
        }
        try {
            var [rows2] = await connection.query('SELECT * FROM gpu_shop gs JOIN gpu_details gd ON gd.productName = gs.productName WHERE gd.size IN (?)'
                , [req.body.size]);
        } catch (error) {
            console.error(error);
        }
        try {
            var [rows3] = await connection.query('SELECT * FROM gpu_shop gs JOIN gpu_details gd ON gd.productName = gs.productName WHERE gd.type IN (?)'
                , [req.body.type]);
        } catch (error) {
            console.error(error);
        }
        const commonRows = rows1.filter(row1 =>
            rows2.some(row2 => row1.productName === row2.productName) &&
            rows3.some(row3 => row1.productName === row3.productName)
        );
        console.log(commonRows);
        res.json({ success: true, gpus: commonRows });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
}






//((md.displaySize < 20 AND "Less than 20" IN ("Less than 20", "All")) OR (md.displaySize >= 20 AND md.displaySize <= 25 AND "20 to 25" IN ("20 to 25", "All")) OR (md.displaySize > 20 AND "Above 20" IN ("Above 20", "All")) OR "All" IN ("Less than 20", "20 to 25", "Above 20", "All")) AND