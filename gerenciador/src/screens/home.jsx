import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity } from "react-native";
import { home_css } from "../styles/homeStyles.js";    

export default function HomePage({onLogout}) {
    <SafeAreaView style = {home_css.container}>
        <Text style = {home_css.titulo}>
            <TouchableOpacity 
                style = {home_css.botaoSair}
                onPress={onLogout}
            >
                <Text style = {home_css.textoBotaoSair}>
                    Sair
                </Text>
            </TouchableOpacity>

        </Text>
    </SafeAreaView>
}