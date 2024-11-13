const connection = require('./dbConnection.js');

exports.postComment = async (req, res) => {
    const currentDate = new Date();
    try {
        await connection.execute('insert into comment(userName,productName,shop,comment,date) values (?,?,?,?,?)',
            [req.body.userName, req.body.productName, req.body.shop, req.body.comment, currentDate]);

        res.json({ success: true, message: "Comment submitted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


exports.fetchComments = async (req, res) => {
    try {
        let [rows] = await connection.execute('select * from comment where productName=? and shop=? order by date desc;',
            [req.body.productName, req.body.shop]);
        res.json({ success: true, comments: rows });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
}