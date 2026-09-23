import * as SQLite from "expo-sqlite";

let databasePromise = null;

// Reaproveito a mesma conexão para evitar abrir o banco a cada consulta.
export async function getDatabase() {
    if (databasePromise === null) {
        databasePromise = SQLite.openDatabaseAsync("gerenciador.db");
    }

    try {
        return await databasePromise;
    } catch (error) {
        // Libero uma nova tentativa de abertura se a conexão falhar.
        databasePromise = null;
        throw error;
    }
}

// Preparo as tabelas antes de permitir o acesso às telas.
export async function initializeDatabase() {
    const db = await getDatabase();

    // Ativo o vínculo entre usuários e tarefas para o SQLite respeitar essa relação.
    await db.execAsync(`
    PRAGMA foreign_keys = ON;
  `);

    // Guardo os dados da conta aqui; deixo a senha no armazenamento seguro.
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // Relaciono cada tarefa ao seu dono por user_id e limito os status e prioridades aceitos.
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      due_time TEXT,

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

    // Confiro as colunas antes de adicionar o horário, preservando os cadastros antigos.
    // Com essa consulta, descubro se a atualização já foi aplicada neste aparelho.
    const columns = await db.getAllAsync("PRAGMA table_info(tasks);");
    if (!columns.some((column) => column.name === "due_time")) {
        await db.execAsync("ALTER TABLE tasks ADD COLUMN due_time TEXT;");
    }
}
