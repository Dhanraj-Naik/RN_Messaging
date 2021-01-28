import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CameraRoll from '@react-native-community/cameraroll';
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

        this.loading = false;
        this.cursor = null;
    }


    async componentDidMount() {

        this.getImages();

    }

    getNextImages = () => {
        if (!this.cursor) return;
        this.getImages(this.cursor);
    };

    getImages = async (after) => {
        const permissionResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (permissionResult !== 'granted') {
            console.log('not granted');
            return;
        }


        if (this.loading) return;
        this.loading = true;
        //get images
        const results = await CameraRoll.getPhotos({ first: 20, after });
        const { edges, page_info: { has_next_page, end_cursor } } = results;

        const loadedImages = edges.map(item => item.node.image);

        this.setState({
            images: this.state.images.concat(loadedImages),
        }, () => {
            this.loading = false;
            this.cursor = has_next_page ? end_cursor : null;
        });
    }

    renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {

        const { onPressImage } = this.props;

        const style = {
            width: size,
            height: size,
            marginLeft,
            marginTop,
        };

        return (
            <TouchableOpacity
                key={uri}
                activeOpacity={0.75}
                onPress={() => onPressImage(uri)}
                style={style}
            >
                <Image source={{ uri }} style={styles.image} />
            </TouchableOpacity>
        );
    }

    render() {
        const { images } = this.state;
        return (
            <Grid
                data={images}
                renderItem={this.renderItem}
                keyExtractor={keyExtractor}
                onEndReached={this.getNextImages}
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
