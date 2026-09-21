import * as SecureStore from "expo-secure-store";

import {
    createUser,
    deleteUser,
    findUserByEmail,
} from "../repositories/userRepository.js";

// Gera uma chave exclusiva para armazenar a senha de cada usuário.
function getPasswordKey(userId) {
    return `user_password_${userId}`;
}

// Valida os dados obrigatórios antes de realizar o cadastro.
function validateRegisterData(name, email, password) {
    if (name.trim() === "") {
        throw new Error("Informe o nome.");
    }

    if (email.trim() === "") {
        throw new Error("Informe o e-mail.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw new Error("Informe um e-mail válido.");
    }

    if (password.trim() === "") {
        throw new Error("Informe a senha.");
    }

    if (password.length < 4) {
        throw new Error("A senha deve possuir pelo menos 4 caracteres.");
    }
}

// Cadastra o usuário no SQLite e mantém a senha separada no armazenamento seguro.
export async function registerUser(name, email, password) {
    validateRegisterData(name, email, password);

    const normalizedEmail = email.trim().toLowerCase();

    // Impede que o mesmo e-mail seja cadastrado mais de uma vez.
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser !== null) {
        throw new Error("Já existe um usuário cadastrado com este e-mail.");
    }

    const userId = await createUser(name, normalizedEmail);
    const passwordKey = getPasswordKey(userId);

    try {
        // A senha não fica armazenada diretamente na tabela de usuários.
        await SecureStore.setItemAsync(
            passwordKey,
            password
        );
    } catch (error) {
        // Remove o cadastro caso a senha não possa ser armazenada com segurança.
        await deleteUser(userId);

        throw new Error("Não foi possível concluir o cadastro.");
    }

    return {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
    };
}

// Confere o e-mail e a senha informados antes de liberar o acesso.
export async function loginUser(email, password) {
    if (email.trim() === "") {
        throw new Error("Informe o e-mail.");
    }

    if (password.trim() === "") {
        throw new Error("Informe a senha.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Localiza primeiro os dados públicos do usuário no SQLite.
    const user = await findUserByEmail(normalizedEmail);

    if (user === null) {
        throw new Error("E-mail ou senha inválidos.");
    }

    const passwordKey = getPasswordKey(user.id);

    // Recupera a senha protegida para comparar com a informação digitada.
    const savedPassword = await SecureStore.getItemAsync(
        passwordKey
    );

    if (savedPassword === null) {
        throw new Error("Não foi possível validar este usuário.");
    }

    if (savedPassword !== password) {
        throw new Error("E-mail ou senha inválidos.");
    }

    return user;
}
