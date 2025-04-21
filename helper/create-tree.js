module.exports.createTree = function (arr, parentId = "", countObj = { value: 0 }) {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      countObj.value++;
      const newItem = { ...item._doc };
      newItem.index = countObj.value;
      const children = module.exports.createTree(arr, item.id, countObj);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};
