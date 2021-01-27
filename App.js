import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Status from './src/components/Status';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderMessageList() {
    return (
      <View style={[styles.content]}>

      </View>
    );
  }

  renderToolbar() {
    return (<View style={styles.toolbar}></View>);
  }

  renderInputMethodEditor() {
    return (
      <View style={styles.inputMethodEditor}></View>);
  }

  render() {
    return (
      <View style={styles.container}>
        <Status />
        {this.renderMessageList()}
        {this.renderToolbar()}
        {this.renderInputMethodEditor()}
      </View>);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
