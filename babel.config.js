module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": ".", // Changed from './app'
            "@components": "./components",
            "@services": "./services",
            "@types": "./types", // Add this line
            "@assets": "./assets",
            "@utils": "./utils",
            "@env": "./env", // Add this line
          },
        },
      ],
    ],
  };
};
