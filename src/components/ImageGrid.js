import React, { Component } from 'react';
import { CameraRoll, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Grid from './Grid';

const TAG = 'ImageGrid.js';

const keyExtractor = ({ uri }) => uri;

class ImageGrid extends Component {

    static propTypes = {
        onPressImage: PropTypes.func,
    };

    static defaultProps = {
        onPressImage: () => { },
    };

    constructor(props) {
        super(props);
        this.state = {
            images: [
                { uri: 'https://picsum.photos/600/600?image=10' },
                { uri: 'https://picsum.photos/600/600?image=20' },
                { uri: 'https://picsum.photos/600/600?image=30' },
                { uri: 'https://picsum.photos/600/600?image=40' },
                { uri: 'https://picsum.photos/600/600?image=10' },
                { uri: 'https://picsum.photos/600/600?image=20' },
                { uri: 'https://picsum.photos/600/600?image=30' },
                // { uri: 'https://picsum.photos/600/600?image=40' },
                // { uri: 'https://picsum.photos/600/600?image=10' },
                // { uri: 'https://picsum.photos/600/600?image=20' },
                // { uri: 'https://picsum.photos/600/600?image=30' },
                // { uri: 'https://picsum.photos/600/600?image=40' },
                // { uri: 'https://picsum.photos/600/600?image=10' },
                // { uri: 'https://picsum.photos/600/600?image=20' },
                // { uri: 'https://picsum.photos/600/600?image=30' },
                // { uri: 'https://picsum.photos/600/600?image=40' },
            ],
        };
    }

    renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {

        const style = {
            width: size,
            height: size,
            marginLeft,
            marginTop,
        };

        return (
            <Image source={{ uri }} style={style} />
        );
    }

    render() {
        const { images } = this.state;
        return (
            <Grid
                data={images}
                renderItem={this.renderItem}
                keyExtractor={keyExtractor}
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
});

export default ImageGrid;
