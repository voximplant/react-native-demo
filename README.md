# React Native Voximplant Demo Application

User agent demo application that uses `react-native-voximplant` and [Voximplant cloud platform](http://voximplant.com) for making/receiving audio/video calls.

## Before you start
You will need free Voximplant developer account setup for making and receiving calls using the SDK. 

Learn more at [quickstart](https://voximplant.com/docs/references/articles/quickstart).

## Getting started

1. Install React Native as described at [https://facebook.github.io/react-native/docs/getting-started.html#content](https://facebook.github.io/react-native/docs/getting-started.html#content)
2. Clone this repository
3. Run `npm install` , all required components will be installed automatically

    ### iOS
      
    1. Run `pod install` from `react-native-demo/ios` folder
    2. Start XCode and open generated `VoximplantDemo.xcworkspace`
    
    Note: To enable ios push notifications in demo project, follow the [the instructions](http://voximplant.com/blog/push-notifications-for-ios/) to add certificates to the Voximplant Cloud
    
    ### Android
    
    no steps required
        
    Note: 
    To enable andorid push notifications in demo preoject:
    
    1. Follow [the instructions](http://voximplant.com/blog/push-notifications-for-android/) to add the certificates to the Voximplant Cloud 
    2. Add `google-services.json` file to android/app folder
    3. Open `app/build.gradle` file and uncomment the `//apply plugin: 'com.google.gms.google-services'` line

4. It is recommended to run `react-native start` command from root project directory.
5. Run your project from XCode (`Cmd+R`) for iOS, or use `react-native run-android` to run your project on Android.

## Demo project dependencies

The demo project uses the following third-party dependencies:
- "react-native-vector-icons" - to implement icon buttons
- "react-native-default-preference" - to store username and login tokens in default pregerences 
- "react-native-fcm" - to support push notifications on android
- "react-native-notifications" - to support push notifications on iOS
- "react-native-md5" - to login with one time key

These are not the dependencies for our react native sdk, but only for demo project. 
Please note that we use these dependencies just to simplify our demo project and to provide the ability to try full functionality of our sdk. Integration of these dependencies to the demo project does not mean that you have to use these dependencies in your project.

## Useful links
Official guides:
- [Using React Native SDK guide](https://voximplant.com/blog/using-react-native-sdk)
- [Migration guide](https://voximplant.com/blog/migration-guide-for-react-native-sdk)