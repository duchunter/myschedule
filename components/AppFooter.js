// Props: timeLeft

import React from 'react';
import { StyleSheet, View, ProgressBarAndroid } from 'react-native';
import { Footer, Text } from 'native-base';

import { main } from 'myschedule/config/color';
import font from 'myschedule/config/font';

import getDuration from 'myschedule/utils/getDuration';

export default class AppFooter extends React.Component {
  render() {
    return (
      <Footer style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ProgressBarAndroid
            style={{ width: '90%' }}
            styleAttr="Horizontal"
            color={'white'}
            indeterminate={false}
            progress={this.props.timeLeft / (24 * 60)}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.text}>
            {getDuration(this.props.timeLeft)}
          </Text>
        </View>
      </Footer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: main.blue,
    alignItems: 'center'
  },

  text: {
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 10,
    fontFamily: font.book,
    fontSize: 14,
    color: 'white'
  }
});
