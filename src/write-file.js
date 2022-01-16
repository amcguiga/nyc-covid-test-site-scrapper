import * as fs from 'fs'

const writeFile = async (data, fileName, dirPath) => {
  try {
    await fs.promises.mkdir(dirPath);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.log('Unable to write directory error', error);
    }
  }

  try {
    await fs.promises.writeFile(`${dirPath}/${fileName}`, JSON.stringify(data));
    console.log(`Output written to ${dirPath}/${fileName}!`);
  } catch (error) {
    console.log('Unable to write file error', error);
  }
};

export { writeFile }