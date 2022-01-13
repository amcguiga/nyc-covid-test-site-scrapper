const fs = require("fs").promises;

const writeFile = async (data, fileName, dirPath) => {
  try {
    await fs.mkdir(dirPath);
  } catch (error) {
    if (error.code !== "EEXIST") {
      console.log("Unable to write error log file", error);
    }
  }

  try {
    await fs.writeFile(`${dirPath}/${fileName}`, JSON.stringify(data));
    console.log(`Output written to ${dirPath}/${fileName}!`);
  } catch (error) {
    console.log("Unable to write error log file", error);
  }
};

module.exports = writeFile;