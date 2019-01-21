// Props:
// currentDay
// closeDrawer, fetchData (function)

import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, ListItem } from 'native-base';

import { main } from 'myschedule/config/color';
import font from 'myschedule/config/font';
import { Days } from 'myschedule/config/constants';

export default class DrawerContent extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        {
          Days.map((day, index) => (
            <ListItem
              key={index}
              onPress={() => {
                this.props.fetchData(index);
                this.props.closeDrawer();
              }}
            >
              <Text
                style={[styles.text, {
                  color: this.props.currentDay == index ? main.blue : 'black'
                }]}
              >
                {day}
              </Text>
            </ListItem>
          ))
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },

  text: {
    fontFamily: font.book,
  }
});
