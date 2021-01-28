import React, { Component } from 'react';
import { BackHandler, LayoutAnimation, Platform, UIManager, View } from 'react-native';
import PropTypes from 'prop-types';
import { isIphoneXorAbove } from '../utils/IphoneXCheck';

export const INPUT_METHOD = {
    NONE: 'NONE',
    KEYBOARD: 'KEYBOARD',
    CUSTOM: 'CUSTOM',
};

const TAG = 'MessagingContainer.js';
class MessagingContainer extends Component {

    static propTypes = {
        // From `KeyboardState`
        containerHeight: PropTypes.number.isRequired,
        contentHeight: PropTypes.number.isRequired,
        keyboardHeight: PropTypes.number.isRequired,
        keyboardVisible: PropTypes.bool.isRequired,
        keyboardWillShow: PropTypes.bool.isRequired,
        keyboardWillHide: PropTypes.bool.isRequired,
        keyboardAnimationDuration: PropTypes.number.isRequired,

        // Managing the IME type
        inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
        onChangeInputMethod: PropTypes.func,

        // Rendering content
        children: PropTypes.node,
        renderInputMethodEditor: PropTypes.func.isRequired,
    }

    static defaultProps = {
        children: null,
        onChangeInputMethod: () => { },
    };


    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            const { onChangeInputMethod, inputMethod } = this.props;

            if (inputMethod === INPUT_METHOD.CUSTOM) {
                onChangeInputMethod(INPUT_METHOD.NONE);
                return true;
            }
            return false;
        });
    }

    componentWillReceiveProps(nextProps) {
        const { onChangeInputMethod } = this.props;
        const { keyboardAnimationDuration } = nextProps;

        const animation = LayoutAnimation.create(
            keyboardAnimationDuration,
            Platform.OS === 'android' ? LayoutAnimation.Types.easeInEaseOut
                : LayoutAnimation.Types.keyboard,
            LayoutAnimation.Properties.opacity,
        );
        LayoutAnimation.configureNext(animation);

        if (!this.props.keyboardVisible && nextProps.keyboardVisible) {
            // Keyboard shown
            onChangeInputMethod(INPUT_METHOD.KEYBOARD);
        } else if (
            // Keyboard hidden
            this.props.keyboardVisible &&
            !nextProps.keyboardVisible &&
            this.props.inputMethod !== INPUT_METHOD.CUSTOM
        ) {
            onChangeInputMethod(INPUT_METHOD.NONE);
        }
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    render() {
        const {
            children,
            renderInputMethodEditor,
            inputMethod,
            containerHeight,
            contentHeight,
            keyboardHeight,
            keyboardWillShow,
            keyboardWillHide,
        } = this.props;

        // For our outer `View`, we want to choose between rendering at full
        // height (`containerHeight`) or only the height above the keyboard
        // (`contentHeight`). If the keyboard is currently appearing
        // (`keyboardWillShow` is `true`) or if it's fully visible
        // (`inputMethod === INPUT_METHOD.KEYBOARD`), we should use
        // `contentHeight`.
        const useContentHeight =
            keyboardWillShow || inputMethod === INPUT_METHOD.KEYBOARD;

        const containerStyle = {
            height: useContentHeight ? contentHeight : containerHeight,
        };

        // We want to render our custom input when the user has pressed the camera
        // button (`inputMethod === INPUT_METHOD.CUSTOM`), so long as the keyboard
        // isn't currently appearing (which would mean the input field has received
        // focus, but we haven't updated the `inputMethod` yet).
        const showCustomInput =
            inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;

        // If `keyboardHeight` is `0`, this means a hardware keyboard is connected
        // to the device. We still want to show our custom image picker when a
        // hardware keyboard is connected, so let's set `keyboardHeight` to `250`
        // in this case.
        const inputStyle = {
            height: showCustomInput ? keyboardHeight || 250 : 0,

            // Show extra space if the device is an iPhone X the keyboard is not visible
            marginTop: isIphoneXorAbove() && (keyboardIsHidden || keyboardIsHiding) ? 24 : 0,
        };

        // The keyboard is hidden and not transitioning up
        const keyboardIsHidden =
            inputMethod === INPUT_METHOD.NONE && !keyboardWillShow;

        // The keyboard is visible and transitioning down
        const keyboardIsHiding =
            inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide;

        return (
            <View style={containerStyle}>
                {children}
                <View style={inputStyle}>{renderInputMethodEditor()}</View>
            </View>
        );
    }
}

export default MessagingContainer;
