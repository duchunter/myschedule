// Props:
// index (int)
// data (obj)
// active (bool)
// deleteTask, toogleActive, adjustDuration (function)

import React from 'react';
import {
  Animated, Easing, StyleSheet, View, Platform, Slider, TouchableOpacity
} from 'react-native';
import { Text, Icon } from 'native-base';
import moment from 'moment';

import font from 'myschedule/config/font';
import { main } from 'myschedule/config/color';
import { IS_IOS, WIDTH } from 'myschedule/config/constants';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    // Setup animation when select a card
    this._active = new Animated.Value(0);
    this._style = {
      ...Platform.select({
        // IOS: use shadow
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        // Android: use elevation
        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      })
    };
  }

  // Active animation if a card is selected or released
  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 200,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  // Return duration string
  getDuration = (duration) => {
    if (duration == 0) {
      return 'Inactive';
    }

    let hours = (duration / 60).toFixed(0);
    let minutes = duration % 60;

    return (hours != 0 ? hours + ' hours ' : '')
      + (minutes ? minutes + ' minutes' : '');
  }

  render() {
    return (
      <Animated.View style={[styles.row, this._style]}>
        {/* Title + action */}
        <View style={styles.rowHeader}>
          {/* Title */}
          <View style={{ flex: 9 }}>
            <Text
              numberOfLines={1}
              style={styles.title}
            >
              {this.props.data.title}
            </Text>
          </View>

          {/* Delete */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={this.props.deleteTask}
          >
            <Icon name={'md-trash'} style={{ fontSize: 16 }} />
          </TouchableOpacity>

          {/* Toogle */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={this.props.toogleTask}
          >
            <Icon
              name={this.props.data.active ? 'ios-pause' : 'ios-play'}
              style={{ fontSize: 16 }}
            />
          </TouchableOpacity>
        </View>

        {/* Duration */}
        <Text style={styles.text}>
          {this.getDuration(this.props.data.duration)}
        </Text>

        {/* Slider */}
        <Slider
          style={styles.slider}
          value={this.props.data.duration}
          minimumTrackTintColor={this.props.data.active ? main.blue : main.NA}
          thumbTintColor={this.props.data.active ? main.blue : main.NA}
          maximumValue={8 * 60}
          step={5}
          onSlidingComplete={value => {
            this.props.adjustTaskDuration(this.props.index, value);
          }}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    width: '90%',
    backgroundColor: 'white',
    marginHorizontal: '5%',
    marginVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,

    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },

      android: {
        elevation: 0,
      },
    })
  },

  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  actionButton: {
    height: 30,
    width: 30,
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center'
  },

  slider: {
    marginTop: 10,
  },

  title: {
    fontFamily: font.medium,
    fontSize: 16
  },

  text: {
    fontFamily: font.book,
    fontSize: 14
  }
});
