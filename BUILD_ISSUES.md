Upgrading to the latest React Native version often leads to some build errors.

We provide the list of the issues that we have faced with and possible fixes for them.

## RN 0.54 - iOS
1. 'algorithm' file not found
    - Community solution: https://github.com/facebook/yoga/issues/711
    - Fix in demo: https://github.com/voximplant/react-native-demo/blob/7da7159ee02f367570c019cfaaae45f48d3a84b8/ios/Podfile

2. RCTSurfaceHostingView.h:12: Expected ‘)’
    - Community solution: https://github.com/facebook/yoga/issues/711
    - Fix in demo: https://github.com/voximplant/react-native-demo/blob/7da7159ee02f367570c019cfaaae45f48d3a84b8/ios/Podfile

3. 'fishhook/fishhook.h' not found
    - Community solution: https://github.com/facebook/react-native/issues/16039
    - Fix in demo: https://github.com/voximplant/react-native-demo/blob/master/package.json#L7

4. 'RCTAnimation/RCTValueAnimatedNode.h' file not found
    - Community solution: https://github.com/facebook/react-native/issues/13198
    - Fix in demo: https://github.com/voximplant/react-native-demo/blob/master/package.json#L7

5. xcrun: error: SDK "iphoneos" cannot be located on *glog* dependency install
    - Community solution: https://github.com/theos/theos/issues/255
    - To fix this issue enviromenent setup should be changed:
        - run ```xcode-select -print-path```
        - check the path printed
        - change it to /Applications/Xcode.app by running ```sudo xcode-select -switch /Applications/Xcode.app ```

## Android build issues (not related to RN)
1. more than one library with package name 'com.google.android.gms.license'
    - Community fix: https://github.com/evollu/react-native-fcm/issues/857
    - This is a demo dependency issue related to Google FCM 12.0 release. The react-native-fcm dependency will be updated as soon as it releases a new version. To resolve the issue until that time, please apply the following changes locally: https://github.com/evollu/react-native-fcm/pull/859/commits/7e103b4c2cd7d73d82d0afd6feffee67fb654e3d
