const Product = require("../../model/PetModel");
const searchHelper = require("../../helper/search");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const products = await Product.find(find);
  res.render("client/pages/products/index", {
    products,
  });
};
module.exports.detail = async(req,res)=>{
  const slug =req.params.slug;
  let find ={
    deleted:false,
    slug:slug
  }
const data= await Product.findOne(find);
res.render('client/pages/products/detail',{data});

}