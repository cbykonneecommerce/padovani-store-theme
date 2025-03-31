module.exports = {
  roots: ["<rootDir>/node"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(.*(test|spec)).tsx?$",
  testEnvironment: "node",
};
