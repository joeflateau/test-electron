module.exports = {
  packagerConfig: {
    ...(process.env.APP_STORE_CONNECT_PASSWORD && {
      osxSign: {
        identity: "Developer ID Application: Upstoric LLC (5A46AL2PS3)",
        "hardened-runtime": true,
        entitlements: "entitlements.plist",
        "entitlements-inherit": "entitlements.plist",
        "signature-flags": "library",
        "gatekeeper-assess": false,
      },
      osxNotarize: {
        appleId: "joe@upstoric.com",
        appleIdPassword: process.env.APP_STORE_CONNECT_PASSWORD,
      },
    }),
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "test_electron",
        ...(process.env.WINDOWS_CERT_CONTAINER_NAME && {
          signWithParams: `/tr http://timestamp.digicert.com /fd sha256 /f ./cert.p12 /csp "eToken Base Cryptographic Provider" /kc "${process.env.WINDOWS_CERT_CONTAINER_NAME}"`,
        }),
        noMsi: false,
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
    {
      name: "@electron-forge/maker-dmg",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "joeflateau",
          name: "test-electron",
        },
        prerelease: false,
        draft: false,
      },
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/entrypoints/renderer.tsx",
              name: "main_window",
            },
          ],
        },
      },
    ],
  ],
};
