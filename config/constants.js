import { Platform, Dimensions } from 'react-native';

// UI
const { height, width } = Dimensions.get('screen');
export const HEIGHT = height;
export const WIDTH = width;

// PLATFORM
export const IS_IOS = Platform.OS === 'ios';

// SOMETHING OBVIOUS
export const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
