module.exports = {
  packagerConfig: {
    asar: true,
    name: "Spruce Markdown App",
    appVersion: "1.0.0",
    icon: "./public/icons/icon",
  },
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "Spruce Markdown App",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "iamspruce",
          name: "Spruce-Markdown-App",
        },
        prerelease: true,
      },
    },
  ],
};
