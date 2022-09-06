let context;
try {
  context = require.context("./", true, /\.md$/);
} catch (error) {
  const fs = require("fs");
  const path = require("path");
  require.context = (
    base = "./",
    scanSubDirectories = true,
    regularExpression = /\.md$/
  ) => {
    const files = {};
    function readDirectory(directory) {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.resolve(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) readDirectory(fullPath);
          return;
        }
        if (!regularExpression.test(fullPath)) return;
        files[fullPath] = true;
      });
    }
    readDirectory(path.resolve(__dirname, base));
    function Module(file) {
      return require(file);
    }
    Module.keys = () => Object.keys(files);
    return Module;
  };
  context = require.context("./", true, /\.md$/);
}

// const context = require.context("./", true, /\.md$/);
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
