const context = require.context("./", true, /\.md$/);
const allMarkdown = [];
context.keys().forEach((key) => {
  if (key.includes("@awesome-astra")) {
    return;
  }
  const fileName = key.replace("./", "");
  const resource = require(`./${fileName}`);
  allMarkdown.push(resource);
});

export { allMarkdown };
