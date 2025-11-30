export default {
  multipass: true,
  plugins: [
    {
      name: "convertColors",
      params: {
        currentColor: true,
      },
    },
    "convertPathData",
    "removeDimensions",
  ],
};
