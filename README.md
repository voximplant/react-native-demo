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
	git clone https://github.com/voximplant/react-native-demo.git temp
	mv temp/.git .
	rm -rf temp
	git reset --hard HEAD
	```

4. Run `npm install` , all required components will be installed automatically
5. Read the instructions for installed react native modules (they will be placed into node_modules folder) , some of them will require additional steps. `react-native-voximplant` example:

    1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
    2. Go to `node_modules` ➜ `react-native-voximplant` and add `VoxImplant.xcodeproj`
    3. In XCode, in the project navigator, select your project. Add `libvoximplant.a, react-native-voximplant/VoxImplantSDK/libVoxImplantSDK.a, libc++.dylib, GLKit.framework` to your project's `Build Phases` ➜ `Link Binary With Libraries`
    4. Click `VoxImplant.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains both `$(SRCROOT)/../react-native/React` and `$(SRCROOT)/../../React` - mark both as `recursive`.

6. Right click on you project in XCode and select **Add files to "_NameOfYourProject_"** and add `Custom.ttf` from the project folder
7. Edit `Info.plist` and add a property called **Fonts provided by application** (if you haven't added one already) and type in the file you just added:
[![FontEmbedding](https://habrastorage.org/files/00a/b2e/648/00ab2e648fb541938910df3c5368decd.png)](https://habrastorage.org/files/00a/b2e/648/00ab2e648fb541938910df3c5368decd.png)
8. Run your project (`Cmd+R`)
