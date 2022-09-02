const context = require.context("./", true, /\.md$/);
const all = {};
context.keys().forEach((key, index) => {
  if (key.includes("@awesome-astra")) {
    return;
  }
  const fileName = key.replace("./", "");
  const resource = require(`./${fileName}`);
  all[index] = resource;
});

export { all };
