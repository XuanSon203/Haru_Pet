const searchHelper = require("../../helper/search");

module.exports.index = async (req, res) => {
   // Tìm kiếm
      const objectSearch = searchHelper(req.query);
      if (objectSearch.regex) {
        find.name = objectSearch.regex;
      }

  res.render("client/pages/home/index");
};
