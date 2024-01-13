const fs = require("fs");
const path = require("path");

const recentFilePath = path.join(__dirname, "../recentFile.txt");

exports.writeRecentFile = (filePath) => {
  try {
    fs.writeFileSync(recentFilePath, filePath);
  } catch (error) {
    console.error("Error writing recent file path:", error.message);
  }
};

exports.readRecentFile = () => {
  try {
    const content = fs.readFileSync(recentFilePath, "utf-8");
    return content.trim();
  } catch (error) {
    console.error("Error reading recent file path:", error.message);
    return null;
  }
};
