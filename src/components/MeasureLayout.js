import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { StatusBarHeight } from '../utils/StatusBarHeight';

const TAG = 'MeasureLayout.js';
class MeasureLayout extends Component {

    static propTypes = {
        children: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            layout: null,
        };
    }

    handleLayout = event => {
        const { nativeEvent: { layout } } = event;
        this.setState({
            layout: {
                ...layout, y:
                    layout.y +
                    (Platform.OS === 'android' ? StatusBarHeight : 0),
            },
        });
    }

    render() {

        const { children } = this.props;
        const { layout } = this.state;

        // Measure the available space with a placeholder view set to flex 1
        if (!layout) {
            return <View onLayout={this.handleLayout} style={styles.container} />;
        }
        return children(layout);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default MeasureLayout;
