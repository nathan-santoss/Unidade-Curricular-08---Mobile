import { getDatabase } from "../database/database.js";

// Converto campos vazios em NULL para representar a ausência de um valor no banco.
function normalizeOptionalText(value) {
    const text = value.trim();
    if (text === "") return null;
    return text;
}

// Vinculo a nova tarefa ao usuário e começo com o status pendente.
export async function createTask(
    userId,
    title,
    description,
    dueDate,
    priority,
    dueTime = ""
) {
    const db = await getDatabase();

    // Uso parâmetros no lugar de concatenar o texto digitado dentro do comando SQL.
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

    // Recupero o identificador gerado para consultar a tarefa completa após o cadastro.
    return result.lastInsertRowId;
}

// Consulto só as tarefas desta conta e trago as mais recentes primeiro.
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

// Combino o ID da tarefa com o do usuário para não consultar dados de outra conta.
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

// Atualizo os campos editáveis e registro a data da alteração.
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

// Modifico apenas a situação da tarefa, mantendo título, prazo e prioridade.
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

// Apago a tarefa somente quando os IDs da tarefa e do dono correspondem.
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
