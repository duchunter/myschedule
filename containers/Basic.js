import React from 'react';
import { StyleSheet, View, DrawerLayoutAndroid } from 'react-native';
import { Container, Content } from 'native-base';
import SortableList from 'react-native-sortable-list';
import moment from 'moment';

import Task from 'myschedule/components/Task';
import AppHeader from 'myschedule/components/AppHeader';
import AppFooter from 'myschedule/components/AppFooter';
import DrawerContent from 'myschedule/components/DrawerContent';

import { WIDTH, Days } from 'myschedule/config/constants';

import getData from 'myschedule/utils/getData';
import saveData from 'myschedule/utils/saveData';

let newOrder = [];

export default class Basic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      day: 7,
      data: []
    }
  }

  componentDidMount() {
    this.fetchData((moment().day() + 6) % 7);
  }

  // Add new task
  addTask = (title, duration, active) => {
    let newTask = {
      title: title || 'Slack',
      duration: duration || 0,
      active: active || false
    }

    let newData = [...this.state.data, newTask];
    this.setState({ data: newData });
    this.updateTimeLeft(newData);
    this.updateData(this.state.day, newData);
  }

  // Active/Deactive task
  toogleTask = (index) => {
    let data = [...this.state.data];
    data[index].active = !data[index].active;
    this.updateTimeLeft(data);
    this.updateData(this.state.day, data);
  }

  // Delete task
  deleteTask = (index) => {
    let data = [...this.state.data];
    data.splice(index, 1);
    this.setState({ data });
    this.updateTimeLeft(data);
    this.updateData(this.state.day, data);
  }

  // Adjust duration of 1 task
  adjustTaskDuration = (index, duration) => {
    let data = [...this.state.data];
    data[index].duration = duration;
    this.updateData(this.state.day, data);
  }

  // Update new order
  updateOrder = () => {
    let updated = false;
    let newData = newOrder.map((newIndex, index) => {
      if (newIndex != index) {
        updated = true;
      }

      return this.state.data[newIndex];
    });

    if (!updated) {
      return;
    }

    newOrder = [];
    this.updateData(this.state.day, newData);
  }

  // Fetch data from storage
  fetchData = async (day) => {
    try {
      let data = await getData(day);
      this.setState({ day });
      setTimeout(() => {
        this.setState({ data });
        this.updateTimeLeft(data);
      }, 0);
    } catch (e) {
      alert('You have bug(s)!');
    }
  }

  // Update data in storage
  updateData = async (day, data) => {
    try {
      await saveData(day, data);
    } catch (e) {
      alert('You have bug(s)!');
    }
  }

  // Update current state
  updateTimeLeft = (data, value) => {
    let total = this.state.total;
    if (data) {
      total = data.reduce((sum, task) => (
        sum + (task.active ? task.duration : 0)
      ), 0);
    }

    if (value) {
      total += value;
    }

    this.setState({ total });
  }

  render() {
    return (
      <DrawerLayoutAndroid
        ref={ref => this._drawer = ref}
        drawerWidth={Math.min(WIDTH * 0.75, 300)}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => (
          <DrawerContent
            currentDay={this.state.day}
            closeDrawer={() => this._drawer.closeDrawer()}
            fetchData={this.fetchData}
          />
        )}
      >
        <Container>
          <AppHeader
            title={Days[this.state.day] || 'Please wait...'}
            addTask={this.addTask}
            openDrawer={() => this._drawer.openDrawer()}
          />

          <Content bounces={false} contentContainerStyle={{ flex: 1 }}>
            <SortableList
              style={{ flex: 1 }}
              data={this.state.data}
              onChangeOrder={order => newOrder = order}
              onReleaseRow={this.updateOrder}
              renderRow={({ data, active, key}) => {
                return (
                  <Task
                    index={key}
                    data={data}
                    active={active}
                    deleteTask={() => this.deleteTask(key)}
                    toogleTask={() => this.toogleTask(key)}
                    adjustTaskDuration={this.adjustTaskDuration}
                    updateTimeLeft={this.updateTimeLeft}
                    duplicateTask={() => {
                      let { title, duration, active } = data;
                      this.addTask(title, duration, active);
                    }}
                  />
                )
              }}
            />
          </Content>

          <AppFooter timeLeft={24 * 60 - this.state.total} />
        </Container>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({

});
