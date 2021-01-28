import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, PixelRatio, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const TAG = 'Grid.js';

class Grid extends Component {

    static propTypes = {
        renderItem: PropTypes.func.isRequired,
        numColumns: PropTypes.number,
        itemMargin: PropTypes.number,
    };

    static defaultProps = {
        numColumns: 4,
        itemMargin: StyleSheet.hairlineWidth,
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderGridItem = (info) => {
        // console.log(TAG, 'renderGridItem', info);
        const { index } = info;
        const { renderItem, numColumns, itemMargin } = this.props;
        const { width } = Dimensions.get('window');
        let size = PixelRatio.roundToNearestPixel(
            (width - itemMargin * (numColumns - 1)) / numColumns,
        );
        console.log(TAG, 'renderGridItem: size', size);
        // We don't want to include a `marginLeft` on the first item of a row
        const marginLeft = index % numColumns === 0 ? 0 : itemMargin;
        // console.log(TAG, 'renderGridItem: marginLeft', marginLeft);
        // We don't want to include a `marginTop` on the first row of the grid
        const marginTop = index < numColumns ? 0 : itemMargin;

        return renderItem({ ...info, size, marginLeft, marginTop });
    }

    render() {
        return (
            <FlatList
                {...this.props}
                renderItem={this.renderGridItem}
                refreshing
            />
        );
    }
}

export default Grid;
