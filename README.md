# React Native Voximplant Demo Application

User agent demo application that uses `react-native-voximplant` and [Voximplant cloud platform](http://voximplant.com) for making/receiving audio/video calls.

## In Action
[![VoxImplant SDK demo](https://habrastorage.org/files/185/1b5/dd6/1851b5dd689e4a688c2f6e68fcf38d81.gif)](http://www.youtube.com/watch?v=gC2iDVl4RRM)

## Getting started

1. Install React Native as described at [https://facebook.github.io/react-native/docs/getting-started.html#content](https://facebook.github.io/react-native/docs/getting-started.html#content)
2. Clone this repository
3. Run `npm install` , all required components will be installed automatically

	### iOS

	1. Run `pod install` from `react-native-demo/ios` folder
	2. Start XCode and open generated VoxImplantDemo.xcworkspace
	3. Run your project (`Cmd+R`)

	Note: To enable ios push notifications in demo project, follow the [the instructions](http://voximplant.com/blog/push-notifications-for-ios/) to add certificates to the Voximplant Cloud

    ### Android
	no steps required
	
	Note: 
	To enable andorid push notifications in demo preoject:
	1. Follow [the instructions](http://voximplant.com/blog/push-notifications-for-android/) to add the certificates to the Voximplant Cloud 
	2. Add `google-services.json` file to android/app folder
	3. Open `app/build.gradle` file and uncomment the `//apply plugin: 'com.google.gms.google-services'` line



4. Run your project from XCode (`Cmd+R`) for iOS, or use `react-native run-android` to run your project on Android.
