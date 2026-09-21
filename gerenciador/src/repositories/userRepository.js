import { getDatabase } from "../database/database.js";

// Cadastra os dados básicos de um usuário no banco local.
export async function createUser(name, email) {
    const db = await getDatabase();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

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

// Procura um usuário pelo e-mail utilizado no login.
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

// Busca um usuário específico utilizando o identificador salvo no banco.
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

// Remove um usuário do banco.
// As tarefas relacionadas também serão removidas pela chave estrangeira.
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
