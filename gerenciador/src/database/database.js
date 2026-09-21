import * as SQLite from "expo-sqlite";

let databasePromise = null;

// Abre o banco apenas uma vez e reutiliza a mesma conexão durante o uso do aplicativo.
export async function getDatabase() {
    if (databasePromise === null) {
        databasePromise = SQLite.openDatabaseAsync("gerenciador.db");
    }

    try {
        return await databasePromise;
    } catch (error) {
        // Permite tentar abrir novamente se o armazenamento falhar temporariamente.
        databasePromise = null;
        throw error;
    }
}

// Prepara as tabelas necessárias sempre que o aplicativo for iniciado.
export async function initializeDatabase() {
    const db = await getDatabase();

    // Ativa o funcionamento das chaves estrangeiras no SQLite.
    await db.execAsync(`
    PRAGMA foreign_keys = ON;
  `);

    // Armazena os usuários cadastrados no aplicativo.
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // Armazena as tarefas e relaciona cada uma ao usuário que a criou.
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,

      priority TEXT NOT NULL DEFAULT 'MEDIA'
        CHECK(priority IN ('BAIXA', 'MEDIA', 'ALTA')),

      status TEXT NOT NULL DEFAULT 'PENDENTE'
        CHECK(status IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA')),

      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `);
}
