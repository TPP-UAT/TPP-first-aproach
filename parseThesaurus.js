const fs = require("fs");

const filePath = "UAT.json"; 

const getId = (key) => {
  return key.split("/").pop();
};

const getProperties = (keys, values) => {
  // Initialize object
  const obj = {};

  // Check the keys to create the object
  keys.map((key, index) => {
    if (key.includes("prefLabel")) {
      obj.name = values[index][0].value;
    }
    if (key.includes("altLabel")) {
      const altNames = [];
      Object.values(values[index]).map((value) => {
        altNames.push(value.value);
      });
      obj.altNames = altNames;
    }
    if (key.includes("definition")) {
      obj.definition = values[index][0].value;
    }
    if (key.includes("broader")) {
      const broaders = [];
      Object.values(values[index]).map((value) => {
        broaders.push(value.value.split("/").pop());
      });
      obj.broaders = broaders;
    }
    if (key.includes("narrower")) {
      const narrowers = [];
      Object.values(values[index]).map((value) => {
        narrowers.push(value.value.split("/").pop());
      });
      obj.narrowers = narrowers;
    }
  });
  return obj;
};

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    const thesaurus = [];
    const keys = Object.keys(jsonData);
    keys.forEach((key, index) => {
      const obj = jsonData[key];
      const properties = getProperties(
        Object.keys(obj),
        Object.values(obj)
      );

      const value = {
        id: getId(key),
        ...properties,
      };
      thesaurus.push(value);
    });
    // console.log('🚀 ~ thesaurus:', thesaurus);

    fs.writeFile("thesaurus.json", JSON.stringify(thesaurus, null, 2), (err) => {
      if (err) {
        console.error("Error writing the file:", err);
        return;
      }
      console.log("Thesaurus parsed successfully!");
    });

  } catch (err) {
    console.error("Error parsing the JSON:", err);
  }
});
