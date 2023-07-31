const fs = require("fs");

const filePath = "thesaurus.json";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    // 1456: 1 y 4
    const obj = jsonData.find((item) => item.id === "1453");

    // replace each broader and narrower from the array with the full objectand make it recursive
    const buildFullObjectRecursive = (obj, iteration, weight) => {
      const newObj = { ...obj, weight: weight };
      if (iteration > 2) return newObj;
      if (newObj.broaders) {
        newObj.broaders = newObj.broaders.map((broader) => {
          return buildFullObjectRecursive(
            jsonData.find((item) => item.id === broader),
            iteration + 1,
            weight - iteration / 10
          );
        });
      }
      if (newObj.narrowers) {
        newObj.narrowers = newObj.narrowers.map((narrower) => {
          return buildFullObjectRecursive(
            jsonData.find((item) => item.id === narrower),
            iteration + 1,
            weight - iteration / 10
          );
        });
      }
      return newObj;
    };

    const res = buildFullObjectRecursive(obj, 1, 1);

    fs.writeFile("example.json", JSON.stringify(res, null, 2), (err) => {
      if (err) {
        console.error("Error writing the file:", err);
        return;
      }
      console.log("res parsed successfully!");
    });
    console.log("🚀 ~ res:", res);
  } catch (err) {
    console.error("Error parsing JSON string:", err);
  }
});
