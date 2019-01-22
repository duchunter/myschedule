// Props:
// index (int)
// data (obj)
// active (bool)
// deleteTask, toogleActive, adjustDuration, duplicateTask (function)
// updateTimeLeft, setTarget (function)

import React from 'react';
import {
  Animated, Easing, StyleSheet, View, Platform, Slider, TouchableOpacity
} from 'react-native';
import { Text, Icon } from 'native-base';
import Prompt from 'myschedule/custom/rn-prompt';
import moment from 'moment';

import font from 'myschedule/config/font';
import { main } from 'myschedule/config/color';
import { IS_IOS, WIDTH } from 'myschedule/config/constants';

import getDuration from 'myschedule/utils/getDuration';
import parseDuration from 'myschedule/utils/parseDuration';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      activation: false,
      showPrompt: false
    }

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

  // Set initial duration
  componentDidMount() {
    let { duration, active } = this.props.data;
    this.setState({
      duration,
      activation: active
    });
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

          {/* Specific duration input */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => this.setState({ showPrompt: true })}
          >
            <Icon name={'md-time'} style={{ fontSize: 16 }} />
          </TouchableOpacity>

          {/* Duplicate */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={this.props.duplicateTask}
          >
            <Icon name={'md-copy'} style={{ fontSize: 16 }} />
          </TouchableOpacity>

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
            onPress={() => {
              this.setState({
                activation: !this.state.activation
              });

              this.props.toogleTask();
            }}
          >
            <Icon
              name={this.state.activation ? 'ios-pause' : 'ios-play'}
              style={{ fontSize: 16 }}
            />
          </TouchableOpacity>
        </View>

        {/* Duration */}
        <Text style={styles.text}>
          {getDuration(this.state.duration)}
        </Text>

        {/* Slider */}
        <Slider
          style={styles.slider}
          value={this.state.duration}
          minimumTrackTintColor={this.state.activation ? main.blue : main.NA}
          thumbTintColor={this.state.activation ? main.blue : main.NA}
          maximumValue={3 * 60}
          step={5}
          onValueChange={value => {
            if (this.state.activation) {
              this.props.updateTimeLeft(null, value - this.state.duration);
            }

            this.setState({ duration: value });
          }}
          onSlidingComplete={value => {
            this.props.adjustTaskDuration(this.props.index, value);
          }}
        />

        {/* Duration input */}
        <Prompt
          title="Enter duration"
          placeholder="hh:ss"
          visible={this.state.showPrompt}
          onCancel={() => this.setState({ showPrompt: false })}
          onSubmit={(value) => {
            this.setState({ showPrompt: false });
            let duration = parseDuration(value);
            if (duration != -1) {
              this.setState({ duration });
              this.props.adjustTaskDuration(this.props.index, duration);
            }
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
