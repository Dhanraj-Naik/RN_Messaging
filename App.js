import React, { Component } from 'react';
import { View, StyleSheet, Text, Alert, TouchableHighlight, Image, BackHandler } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import MessageList from './src/components/MessageList';
import Status from './src/components/Status';
import Toolbar from './src/components/Toolbar';
import { createImageMessage, createLocationMessage, createTextMessage } from './src/utils/MessageUtils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        createTextMessage('Hello'),
        createLocationMessage({
          latitude: 37.78825,
          longitude: -122.4324,
        }),
        createImageMessage('https://unsplash.it/300/300'),
        createTextMessage('Guys'),
      ],
      fullscreenImageId: null,
      isInputFocused: false,
    };
  }

  handlePressToolbarCamera = () => {

  }

  handlePressToolbarLocation = () => {
    const { messages } = this.state;

    const permission = this.requestLocationPermission();

    if (!permission) return;

    Geolocation.getCurrentPosition((position) => {
      //success
      console.log('handlePressToolbarLocation res', position);
      const { coords: { latitude, longitude } } = position;
      this.setState({
        messages: [
          createLocationMessage({
            latitude, longitude,
          }),
          ...messages,
        ],
      });
    }, (res) => {
      //no permissions or other errors
      console.log('handlePressToolbarLocation err', res);
      //error
    });

  }
  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };



  componentDidMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage(); return true;
      }
      return false;
    });

   
  }

  requestLocationPermission = async () => {
    const permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (permissionResult === 'granted') {
      console.log('granted');
      return true;
    } else {
      return false;
    }
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image) return null;
    const { uri } = image;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
      >
        <Image
          style={styles.fullscreenImage}
          source={{ uri }}
        />

      </TouchableHighlight>
    );

  }

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [{
            text: 'Cancel',
            style: 'cancel',
          }, {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const { messages } = this.state;
              this.setState({
                messages: messages.filter(message => message.id !== id),
              });
            },
          },
          ],

        );
        break;

      case 'image':
        this.setState({ fullscreenImageId: id, isInputFocused: false });
        break;

      default:
        break;
    }
  }

  renderMessageList() {
    const { messages } = this.state;
    return (
      <View style={[styles.content]}>
        <MessageList
          messages={messages}
          onPressMessage={this.handlePressMessage}
        />
      </View>
    );
  }

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
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
        {this.renderFullscreenImage()}
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
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default App;
