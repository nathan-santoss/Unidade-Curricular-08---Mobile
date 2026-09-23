import * as SecureStore from "expo-secure-store";

import {
    createUser,
    deleteUser,
    findUserByEmail,
} from "../repositories/userRepository.js";

// Separo as senhas por uma chave que inclui o ID de cada conta.
function getPasswordKey(userId) {
    return `user_password_${userId}`;
}

// Confiro os dados obrigatórios antes de começar a gravação do cadastro.
function validateRegisterData(name, email, password) {
    if (name.trim() === "") {
        throw new Error("Informe o nome.");
    }

    if (email.trim() === "") {
        throw new Error("Informe o e-mail.");
    }

    // Com essa expressão, verifico se o e-mail tem texto antes e depois do @ e um domínio.
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

// Divido o cadastro entre os dados públicos no SQLite e a senha no SecureStore.
export async function registerUser(name, email, password) {
    validateRegisterData(name, email, password);

    // Retiro espaços nas pontas e padronizo maiúsculas para comparar o mesmo endereço.
    const normalizedEmail = email.trim().toLowerCase();

    // Verifico se o e-mail já existe para evitar uma conta duplicada.
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser !== null) {
        throw new Error("Já existe um usuário cadastrado com este e-mail.");
    }

    const userId = await createUser(name, normalizedEmail);
    const passwordKey = getPasswordKey(userId);

    try {
        // Reservo o SecureStore para guardar a senha fora da tabela de usuários.
        await SecureStore.setItemAsync(
            passwordKey,
            password
        );
    } catch (error) {
        // Desfaço o cadastro incompleto quando não consigo salvar a senha.
        await deleteUser(userId);

        throw new Error("Não foi possível concluir o cadastro.");
    }

    return {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
    };
}

// Valido as credenciais antes de devolver a conta autenticada.
export async function loginUser(email, password) {
    if (email.trim() === "") {
        throw new Error("Informe o e-mail.");
    }

    if (password.trim() === "") {
        throw new Error("Informe a senha.");
    }

    // Retiro espaços nas pontas e padronizo maiúsculas para comparar o mesmo endereço.
    const normalizedEmail = email.trim().toLowerCase();

    // Busco primeiro a conta para descobrir qual chave de senha consultar.
    const user = await findUserByEmail(normalizedEmail);

    if (user === null) {
        throw new Error("E-mail ou senha inválidos.");
    }

    const passwordKey = getPasswordKey(user.id);

    // Leio a senha do armazenamento seguro para comparar com o valor informado.
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
