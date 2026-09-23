import { getDatabase } from "../database/database.js";

// Registro nome e e-mail no banco local e devolvo o ID criado pelo SQLite.
export async function createUser(name, email) {
    const db = await getDatabase();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Passo os valores separados do SQL: os pontos de interrogação recebem esses dados.
    const result = await db.runAsync(
        `
      INSERT INTO users (
        name,
        email
      )
      VALUES (?, ?);
    `,
        normalizedName,
        normalizedEmail
    );

    return result.lastInsertRowId;
}

// Procuro a conta pelo e-mail já convertido para letras minúsculas.
export async function findUserByEmail(email) {
    const db = await getDatabase();

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.getFirstAsync(
        `
      SELECT
        id,
        name,
        email,
        created_at,
        updated_at
      FROM users
      WHERE email = ?
      LIMIT 1;
    `,
        normalizedEmail
    );

    return user;
}

// Localizo o usuário pelo ID para recuperar os dados da sessão.
export async function findUserById(userId) {
    const db = await getDatabase();

    const user = await db.getFirstAsync(
        `
      SELECT
        id,
        name,
        email,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      LIMIT 1;
    `,
        userId
    );

    return user;
}

// Excluo a conta; o vínculo configurado no banco também remove suas tarefas.
export async function deleteUser(userId) {
    const db = await getDatabase();

    await db.runAsync(
        `
      DELETE FROM users
      WHERE id = ?;
    `,
        userId
    );
}
