# React Native SDK Dev App

This app lets you try the Voximplant React Native SDK on a phone or simulator. Sign in with a Voximplant user, then make and receive voice and video calls, and join conferences.

You can:

- Connect to a Voximplant node and log in
- Preview the local camera before a call
- Start a one-to-one call or join a conference
- Answer an incoming call
- Switch audio devices and adjust call settings during a session

Guides and the API reference: [voximplant.com/docs](https://voximplant.com/docs).

## Requirements

| Requirement | Version |
| --- | --- |
| Node.js | >= 22 |
| Yarn | 4 (via the repo `.yarnrc.yml`) |

You also need a React Native development environment on your machine for the platform you want to run: Xcode for iOS, Android Studio for Android, or both. Follow the official [environment setup](https://reactnative.dev/docs/set-up-your-environment) for the React Native version in `package.json`.

You need a Voximplant account with [users](https://voximplant.com/docs/getting-started/basic-concepts/users), [scenarios](https://voximplant.com/docs/getting-started/basic-concepts/scenarios), and [routing rules](https://voximplant.com/docs/getting-started/basic-concepts/routing-rules) already set up. The app signs in as a user in the form `user@app.account.voximplant.com`, and calls only connect when a scenario and a rule handle them.

## Run the app

Clone this repository. From the repository root, install the dependencies (including the Voximplant React Native SDK from npm) and start Metro:

```bash
yarn
yarn bootstrap   # first time: install Ruby gems used by CocoaPods
yarn start
```

In another terminal:

```bash
yarn ios
# or
yarn android
```

On the login screen, pick the connection node for your account and sign in. From the home screen, start a call or join a conference.

If Metro serves a stale bundle, stop it and run `yarn start:reset-cache`.

## For maintainers

The sections below are for people changing this app against a local SDK checkout. They are not required to run the app with the SDK installed from npm.

### Local SDK paths

Point these files at the SDK repository on your machine, and update them again when a new package with native code is added. `<sdk-root>` is that checkout, wherever you cloned it.

1. **package.json** — linked package paths:

    ```json
    "dependencies": {
      "@voximplant/react-native-core": "link:<sdk-root>/packages/core",
      "@voximplant/react-native-calls": "link:<sdk-root>/packages/calls"
    }
    ```

2. **metro.config.js** — `SDK_ROOT_PATH` and the package folders Metro should watch:

    ```js
    const SDK_ROOT_PATH = path.resolve('<sdk-root>')

    const config = {
      watchFolders: [
        path.resolve(SDK_ROOT_PATH, 'packages', 'core'),
        path.resolve(SDK_ROOT_PATH, 'packages', 'calls')
      ],
      resolver: {
        extraNodeModules: [
          path.resolve(SDK_ROOT_PATH, 'packages', 'core'),
          path.resolve(SDK_ROOT_PATH, 'packages', 'calls')
        ]
      }
    }
    ```

3. **react-native.config.js** — SDK packages with native modules for codegen. Codegen script incorrectly fails without this, so we explicitly specify the platforms with empty object:

    ```js
    dependencies: {
      '@voximplant/react-native-core': {
        platforms: { ios: {}, android: {} }
      },
      '@voximplant/react-native-calls': {
        platforms: { ios: {}, android: {} }
      }
    }
    ```

### Development workflow

When the app links a local SDK checkout, run `yarn gen` before the first native build, and again after native module specs change. With the SDK installed from npm, `yarn ios` and `yarn android` generate that code themselves.

**SDK:**

1. Pull SDK changes
2. `yarn`
3. `yarn build`

**Dev app:**

1. Pull dev app changes
2. Configure SDK paths (see [Local SDK paths](#local-sdk-paths)) — first time and when a new package with native code is added
3. `yarn`
4. `yarn bootstrap` — first time only
5. `yarn gen`
    - or `yarn gen:android` / `yarn gen:ios`
6. `yarn start`
    - or `yarn start:reset-cache` if Metro is serving a stale bundle
7. `yarn ios` / `yarn android`

### Clean rebuild

Use this when the dev app is in a broken or inconsistent state (stale Pods, codegen drift, Metro cache issues, native build failures after pulling SDK changes).

**SDK:**

1. Pull SDK changes
2. `yarn clean`
3. `yarn`
4. `yarn build`

**Dev app:**

1. Pull dev app changes
2. `yarn deintegrate`
3. `yarn clean`
4. `yarn`
5. `yarn gen`
    - or `yarn gen:android` / `yarn gen:ios`
6. `yarn start:reset-cache`
7. `yarn ios` / `yarn android`

Optional, for iOS native build issues: clear the contents of Xcode DerivedData directory:

```bash
rm -r ~/Library/Developer/Xcode/DerivedData/*
```

## License

This app is licensed under the Apache License 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
