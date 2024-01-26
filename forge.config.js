module.exports = {
  packagerConfig: {
    asar: true,
    name: "Spruce Markdown App",
    appVersion: "1.0.0",
    icon: "./public/icons/icon",
    prune: true,
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
        name: "SpruceMarkdownApp",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      executableName: "SpruceMarkdownApp",
      config: {
        options: {
          icon: "./public/icons/icon.png",
          name: "SpruceMarkdownApp",
          productName: "SpruceMarkdownApp",
        },
      },
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
        draft: true,
      },
    },
  ],
};
