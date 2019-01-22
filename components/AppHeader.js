// Props:
// title (string)
// addTask, openDrawer (function)

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Header, Left, Body, Right, Icon, Button } from 'native-base';
import Prompt from 'myschedule/custom/rn-prompt';

import { main } from 'myschedule/config/color';
import font from 'myschedule/config/font';

export default class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promptVisible: false
    }
  }

  render() {
    return (
      <Header style={styles.container}>
        <Left>
          <Button
            transparent
            onPress={this.props.openDrawer}
          >
            <Icon name={'md-menu'} style={styles.icon}/>
          </Button>
        </Left>

        <Body>
          <Text
            numberOfLines={1}
            style={styles.text}
          >
            {this.props.title}
          </Text>
        </Body>

        <Right>
          <Button
            transparent
            onPress={() => this.setState({ promptVisible: true })}
          >
            <Icon name={'md-add'} style={styles.icon}/>
          </Button>
        </Right>

        {/* Task title input */}
        <Prompt
          title="Enter task"
          placeholder="Anything"
          visible={this.state.promptVisible}
          onCancel={() => this.setState({ promptVisible: false })}
          onSubmit={(value) => {
            this.setState({ promptVisible: false });
            this.props.addTask(value);
          }}
        />
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: main.blue,
  },

  text: {
    fontFamily: font.medium,
    fontSize: 17,
    color: 'white'
  },

  icon: {
    color: 'white'
  }
});
