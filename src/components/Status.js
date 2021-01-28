import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { StatusBarHeight } from '../utils/StatusBarHeight';

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: true,
        };
    }

    async componentDidMount() {
        this.subscription = NetInfo.addEventListener(state => {
            console.log('Connection type', state);
            this.setState({
                info: state.isInternetReachable,
            });
        });
        const info = await NetInfo.fetch();

        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
            // info: info.isConnected,
            info: info.isInternetReachable || false,
        });
    }

    componentWillUnmount() {
        this.subscription();
    }

    render() {
        const { info } = this.state;
        const isConnected = info;
        const backgroundColor = isConnected ? 'white' : 'red';

        const statusBar = (
            <StatusBar
                backgroundColor={backgroundColor} //android only
                barStyle={isConnected ? 'dark-content' : 'light-content'} //dark-content || light-content || default
                animated={false}
            />
        );

        const messageContainer = (
            <View style={styles.messageContainer} pointerEvents={'none'}>
                {statusBar}
                { !isConnected &&
                    <View style={styles.bubble}>
                        <Text style={styles.text}>
                            {'No network connection'}
                        </Text>
                    </View>
                }
            </View>
        );

        if (Platform.OS === 'ios') {
            return (
                <View style={[styles.status, { backgroundColor }]}>
                    {messageContainer}
                </View>
            );
        }
        return messageContainer;
    }
}

const styles = StyleSheet.create({
    status: {
        height: StatusBarHeight,
        zIndex: 1,
    },
    messageContainer: {
        zIndex: 1,
        ...StyleSheet.absoluteFillObject,
        top: StatusBarHeight + 20,
        height: 80,
        alignItems: 'center',
    },
    bubble: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'red',
    },
    text: {
        color: 'white',
    },
});

export default Status;
