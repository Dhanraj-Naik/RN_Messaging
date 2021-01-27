import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { MessageShape } from '../utils/MessageUtils';


const keyExtractor = item => item.id.toString();

class MessageList extends Component {

    static propeTypes = {
        messages: PropTypes.arrayOf(MessageShape).isRequired,
        onPressMessage: PropTypes.func,
    }

    static defaultProps = {
        onPressMessage: () => { },
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderMessageItem = ({ item }) => {
        const { onPressMessage } = this.props;
        console.log('renderMessageItem:', item);
        return (
            <View key={item.id} style={styles.messageRow}>
                <TouchableOpacity
                    onPress={() => onPressMessage(item)}
                >
                    {this.renderMessageBody(item)}
                </TouchableOpacity>
            </View>
        );
    }

    renderMessageBody = ({ type, text, uri, coordinate }) => {
        switch (type) {
            case 'text':
                return (
                    <View style={styles.messageBubble}>
                        <Text style={styles.text}>{text}</Text>
                    </View>);
            case 'image':
                return <Image style={styles.image} source={{ uri }} />;
            case 'location': return (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        ...coordinate,
                        latitudeDelta: 0.08,
                        longitudeDelta: 0.04,
                    }}
                >
                    <MapView.Marker coordinate={coordinate} />
                </MapView>
            );
            default: return null;
        }
    }


    render() {

        const { messages } = this.props;
        return (
            <View>
                <FlatList
                    // style={styles.container}
                    data={messages}
                    renderItem={this.renderMessageItem}
                    keyExtractor={keyExtractor}
                    keyboardShouldPersistTaps={'handled'}
                    inverted
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible', //prevents clipping on resize
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 4,
        marginRight: 10,
        marginLeft: 60,
    },
    messageBubble: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'rgb(16,135,255)',
        borderRadius: 20,
    }, text: {
        fontSize: 18,
        color: 'white',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    map: {
        width: 250,
        height: 250,
        borderRadius: 10,
        backgroundColor: 'green',
    },
});

export default MessageList;
