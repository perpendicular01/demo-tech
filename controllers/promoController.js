const connection = require("./dbConnection.js");

exports.validatePromo = async (req, res) => {
  try {
    let [rows] = await connection.execute(
      "select * from promo_code where code=?",
      [req.body.content]
    );
    if (rows.length > 0) {
      res.json({
        success: true,
        discountPercentage: rows[0].percentage / 100,
        message: "Promo applied successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Promo failed" });
  }
};
