const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const path = require("path");

exports.createInvoice = (req, res) => {
  try {
    var total = 0;
    const invoiceItems = req.body;
    for (var i = 0; i < invoiceItems.length; i++) {
      total += invoiceItems[i].itemCount * invoiceItems[i].price;
    }
    console.log(total);
    // Create a new PDF document
    var doc = new PDFDocument({ margin: 30, size: "A4" });

    const outputDir = path.join("__dirname",'../invoice', "output");

    // Add timestamp to the file name to make it unique
    const currentTimeStamp = new Date().getTime(); // Get current timestamp
    const outputPath = path.join(outputDir, `invoice_${currentTimeStamp}.pdf`);

    // Ensure the output directory exists, if not, create it
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Pipe the PDF output to a writable stream to save it
    const outputStream = fs.createWriteStream(outputPath);

    // Pipe the PDF output to the writable stream
    doc.pipe(outputStream);

    const tableArray = {
      headers: ["Product Name", "Count", "Shop", "Price"],
      rows: invoiceItems.map((item) => [
        item.productName,
        item.itemCount,
        item.shop,
        `${item.price * item.itemCount}`, // Calculate total price here
      ]),
    };

    const additionalRow = ["", "", "Total Price:", total]; // Replace with actual data
    tableArray.rows.push(additionalRow);

    doc.table(tableArray, { width: 500 });
    // Finalize the PDF document
    doc.end();

    res.json({ success: true, message: "Invoice created successfully" });
  } catch (error) {
    res.json({ success: false, message: `${error}` });
  }
};
