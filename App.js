import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';

import Basic from './containers/Basic';

import { IS_IOS } from 'myschedule/config/constants';

type Props = {};
export default class App extends Component<Props> {
  // Hide SplashScreen
  componentDidMount() {
    // IOS SplashScreen
    if (IS_IOS) {
      SplashScreen.hide();
    }

    // Android SplashScreen
    else {
      setTimeout(SplashScreen.hide, 100);
    }
  }

  render() {
    return (
      <Basic/>
    );
  }
}
