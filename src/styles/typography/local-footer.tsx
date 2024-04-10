// @ts-nocheck
module.exports = function () {
  return function ({addComponents}) {
    const components = {
      ".local-footer": {
        "h2": {
          fontSize: "1.2em",
          "a": {
            "&:hover": {
              color: "#8AB8A7",
              textDecorationThickness: "2px",
            },
          }
        },
        "h3": {
          fontSize: "1.3em",
        },
        "h4": {
          fontSize: "1.1em",
        },
        "ul": {
          color: "#fff",
          listStyle: "none",
          paddingLeft: "0",
        },
      },
    };

    addComponents(components);
  };
};