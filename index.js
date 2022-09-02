const context = require.context("./docs", true, /\.md$/);
const all = [];
context.keys().forEach((key) => {
  console.log({ key });
  if (key.includes("@riptano")) {
    return;
  }
  const fileName = key.replace("./", "");
  const resource = require(`./${fileName}`);
  all[fileName] = resource;
});

export { all };
