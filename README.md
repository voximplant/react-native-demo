# React Native Voximplant Demo Application

User agent demo application that uses `react-native-voximplant` and [VoxImplant cloud platform](http://voximplant.com) for making/receiving audio/video calls.

## In Action
[![VoxImplant SDK demo](https://habrastorage.org/files/185/1b5/dd6/1851b5dd689e4a688c2f6e68fcf38d81.gif)](http://www.youtube.com/watch?v=gC2iDVl4RRM)

## Getting started

1. Install React Native as described at [https://facebook.github.io/react-native/docs/getting-started.html#content](https://facebook.github.io/react-native/docs/getting-started.html#content)
2. Create new application using `react-native init VoximplantDemo`
3. Execute:

	```sh
	cd VoximplantDemo
	wget https://github.com/voximplant/react-native-demo/archive/master.zip
	unzip -j master.zip
	rm -rf master.zip
	mkdir Fonts && cp Custom.ttf Fonts/Custom.ttf && rm Custom.ttf
	```

4. Run `npm install` , all required components will be installed automatically
5. Read the instructions for installed react native modules (they will be placed into node_modules folder) , some of them will require additional steps. `react-native-voximplant` example:

	### iOS

    #### Option: Manual

	1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
	2. Go to `node_modules` ➜ `react-native-voximplant/ios` and add `VoxImplant.xcodeproj`
	3. In XCode, in the project navigato r, select your project. Add `libvoximplant.a, react-native-voximplant/VoxImplantSDK/libVoxImplantSDK.a, libc++.dylib or libc++.tbd, GLKit.framework` to your project's `Build Phases` ➜ `Link Binary With Libraries`
	4. Click `VoxImplant.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains `$(SRCROOT)/../node_modules/react-native/React` and mark as `recursive`. Look for `Library Search Paths` and add `$(SRCROOT)/../node_modules/react-native-voximplant/ios/VoxImplantSDK/lib` 
    5. Right click on you project in XCode and select **Add files to "_NameOfYourProject_"** and add `Custom.ttf` from the project folder
    6. Edit `Info.plist` and add a property called **Fonts provided by application** (if you haven't added one already) and type in the file you just added: [![FontEmbedding](https://habrastorage.org/files/00a/b2e/648/00ab2e648fb541938910df3c5368decd.png)](https://habrastorage.org/files/00a/b2e/648/00ab2e648fb541938910df3c5368decd.png)
	7. Edit `Info.plist` file and add `NSMicrophoneUsageDescription` and `NSCameraUsageDescription` key for iOS 10 support:

		```
		<key>NSMicrophoneUsageDescription</key>
		<string>Need microphone access for audio and video calls</string>
		<key>NSCameraUsageDescription</key>
		<string>Need camera access for video calls</string>
		```

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
