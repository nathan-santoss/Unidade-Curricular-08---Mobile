import { getDatabase } from "../database/database.js";

// Campos opcionais vazios são gravados como NULL tanto no cadastro quanto na edição.
function normalizeOptionalText(value) {
    const text = value.trim();
    if (text === "") return null;
    return text;
}

// Cadastra uma nova tarefa vinculada ao usuário autenticado.
export async function createTask(
    userId,
    title,
    description,
    dueDate,
    priority,
    dueTime = ""
) {
    const db = await getDatabase();

    const result = await db.runAsync(
        `
      INSERT INTO tasks (
        user_id,
        title,
        description,
        due_date,
        due_time,
        priority,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
        userId,
        title.trim(),
        normalizeOptionalText(description),
        normalizeOptionalText(dueDate),
        normalizeOptionalText(dueTime),
        priority,
        "PENDENTE"
    );

    return result.lastInsertRowId;
}

// Busca todas as tarefas pertencentes a um usuário.
export async function findTasksByUser(userId) {
    const db = await getDatabase();

    const tasks = await db.getAllAsync(
        `
      SELECT
        id,
        user_id,
        title,
        description,
        due_date,
        due_time,
        priority,
        status,
        created_at,
        updated_at
      FROM tasks
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC;
    `,
        userId
    );

    return tasks;
}

// Busca uma tarefa específica e garante que ela pertença ao usuário informado.
export async function findTaskById(taskId, userId) {
    const db = await getDatabase();

    const task = await db.getFirstAsync(
        `
      SELECT
        id,
        user_id,
        title,
        description,
        due_date,
        due_time,
        priority,
        status,
        created_at,
        updated_at
      FROM tasks
      WHERE id = ?
        AND user_id = ?
      LIMIT 1;
    `,
        taskId,
        userId
    );

    return task;
}

// Atualiza as informações principais de uma tarefa existente.
export async function updateTask(
    taskId,
    userId,
    title,
    description,
    dueDate,
    priority,
    dueTime = ""
) {
    const db = await getDatabase();

    await db.runAsync(
        `
      UPDATE tasks
      SET
        title = ?,
        description = ?,
        due_date = ?,
        due_time = ?,
        priority = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND user_id = ?;
    `,
        title.trim(),
        normalizeOptionalText(description),
        normalizeOptionalText(dueDate),
        normalizeOptionalText(dueTime),
        priority,
        taskId,
        userId
    );
}

// Altera apenas o status da tarefa sem modificar seus outros dados.
export async function updateTaskStatus(
    taskId,
    userId,
    status
) {
    const db = await getDatabase();

    await db.runAsync(
        `
      UPDATE tasks
      SET
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND user_id = ?;
    `,
        status,
        taskId,
        userId
    );
}

// Remove uma tarefa pertencente ao usuário informado.
export async function deleteTask(
    taskId,
    userId
) {
    const db = await getDatabase();

    await db.runAsync(
        `
      DELETE FROM tasks
      WHERE id = ?
        AND user_id = ?;
    `,
        taskId,
        userId
    );
}
