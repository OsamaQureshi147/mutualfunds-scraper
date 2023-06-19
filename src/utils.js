const parseAbbreviation = (words) => {
  if (words.includes("(")) {
    return words
      .slice(0, words.indexOf("("))
      .trim()
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
  } else
    return words
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
};

module.exports = {
  parseAbbreviation,
};
