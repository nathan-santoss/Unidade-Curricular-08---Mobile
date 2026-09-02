import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from './styles';

export default function CustomInput({ label, onChangeText, placeholder, keyboardType, secureTextEntry }) {
    // Primeiro eu monto a estrutura de cada campo do formulário.
    return (
        <View style={styles.container}>
            {/* Aqui eu exibo o rótulo descritivo acima do campo. */}
            <Text style={styles.label}>{label}</Text>

            {/* Agora eu preparo o campo onde o usuário irá digitar os dados. */}
            {/* Sem o uso do value atrelado a um estado, o componente gerencia seu próprio texto visualmente. */}
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}