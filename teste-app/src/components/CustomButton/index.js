import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles';

export default function CustomButton({ title, onPress }) {
    // Aqui eu preparo o componente de botão para ser interativo no mobile.
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {/* Em seguida eu adiciono o título centralizado do botão. */}
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}