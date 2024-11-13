const connection = require('./dbConnection.js');
// const { scrapeStartech } = require('./scrapeGPU.js');
const { scrapeStartechMoni } = require('./scrapeMonitor.js');
const { scrapeTechlandMoni } = require('./scrapeMonitor.js');
const { scrapePcHouseMoni } = require('./scrapeMonitor.js');

exports.fetchMonitorData=async(req,res)=>{
    try{
        // scrapeStartechMoni();
        // scrapeTechlandMoni();
        // scrapePcHouseMoni();
        let [rows]=await connection.execute('SELECT * FROM monitor_shop INNER JOIN monitor_details ON monitor_shop.productName = monitor_details.productName;');
        res.json({success:true,monitors:rows});
    }catch(error){
        console.error(error);
        res.json({success:false});
    }
    
}

exports.fetchCPUData=async(req,res)=>{
    try{
        let [rows]=await connection.execute('SELECT * FROM cpu_shop INNER JOIN cpu_details ON cpu_shop.productName = cpu_details.productName;');
        res.json({success:true,cpus:rows});
    }catch(error){
        console.error(error);
        res.json({success:false});
    }
}

exports.fetchGPUData=async(req,res)=>{
    try{
        // scrapeStartech();
        let [rows]=await connection.execute('SELECT * FROM gpu_shop INNER JOIN gpu_details ON gpu_shop.productName = gpu_details.productName;');
        res.json({success:true,gpus:rows});
    }catch(error){
        console.error(error);
        res.json({success:false});
    }
}

exports.fetchRAMData=async(req,res)=>{
    try{
        let [rows]=await connection.execute('SELECT * FROM ram_shop INNER JOIN ram_details ON ram_shop.productName = ram_details.productName;');
        res.json({success:true,rams:rows});
    }catch(error){
        console.error(error);
        res.json({success:false});
    }
}