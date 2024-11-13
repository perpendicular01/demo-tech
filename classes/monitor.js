class Monitor{
    constructor(productName,resolution,displaySize,panelType,refreshRate,price,warranty,srcLink,shop,imageLocation){
        this.productName = productName;
        this.resolution = resolution;
        this.displaySize = displaySize;
        this.panelType = panelType;
        this.refreshRate = refreshRate;
        this.price = price;
        this.warranty = warranty;
        this.srcLink = srcLink;
        this.shop = shop;
        this.imageLocation = imageLocation;
    }
}

module.exports = Monitor;