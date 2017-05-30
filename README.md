# React Native Voximplant Demo Application

User agent demo application that uses `react-native-voximplant` and [VoxImplant cloud platform](http://voximplant.com) for making/receiving audio/video calls.

## In Action
[![VoxImplant SDK demo](https://habrastorage.org/files/185/1b5/dd6/1851b5dd689e4a688c2f6e68fcf38d81.gif)](http://www.youtube.com/watch?v=gC2iDVl4RRM)

## Getting started

1. Install React Native as described at [https://facebook.github.io/react-native/docs/getting-started.html#content](https://facebook.github.io/react-native/docs/getting-started.html#content)
2. Clone this repository
3. Execute:
4. Run `npm install` , all required components will be installed automatically
5. Read the instructions for installed react native modules (they will be placed into node_modules folder) , some of them will require additional steps. `react-native-voximplant` example:

	### iOS

    #### Option: Manual

1. Run `pod install`
2. Start XCode and open project with it.
3. In XCode, in the project navigator, select your project. Add `libreact-native-voximplant.a` 
to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)

    #### Option: With [`rnpm`](https://github.com/rnpm/rnpm)

    `$ rnpm link`

    *Note: Some users are having trouble using this method, try one of the others if you are too.*
 

    ### Android
	1. Open up `android/app/main/java/[...]/MainApplication.java`
    	- Add `import com.voximplant.reactnative.VoxImplantReactPackage;` to the imports at the top of the file
    	- Add `new VoxImplantReactPackage()` to the list returned by the `getPackages()` method

	3. Append the following lines to `android/settings.gradle`:

    	```
    	include ':react-native-voximplant'
    	project(':react-native-voximplant').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-voximplant/android')
    	```

	4. Insert the following lines inside the dependencies block in `android/app/build.gradle`:

    	```
    	compile project(':react-native-voximplant')
    	```    

	5. And finally, in android/src/main/AndroidManifest.xml add user permissions

    	```
    	<uses-permission android:name="android.permission.CAMERA" />
    	<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    	<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    	<uses-permission android:name="android.permission.RECORD_AUDIO" />
    	<uses-permission android:name="android.permission.INTERNET" />
    	```

    #### Option: With [`rnpm`](https://github.com/rnpm/rnpm)

    `$ rnpm link`

    *Note: Some users are having trouble using this method, try one of the others if you are too.*


8. Run your project from XCode (`Cmd+R`) for iOS, or use `react-native run-android` to run your project on Android.
