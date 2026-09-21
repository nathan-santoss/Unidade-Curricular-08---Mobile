const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createEnvironment } = require("./helpers.cjs");

async function setup(t) {
    const env = createEnvironment();
    t.after(() => env.db.close());
    await env.load("src/database/database.js").initializeDatabase();
    return env;
}

async function createAccount(env, name = "Ana", email = "ana@example.com") {
    const result = await env.load("src/controllers/authController.js").registerController(name, email, "senha123");
    assert.equal(result.success, true, result.message);
    return result.user;
}

test("Inicialização é idempotente e preserva registros e restrições", async (t) => {
    const env = await setup(t);
    const user = await createAccount(env);
    await env.load("src/database/database.js").initializeDatabase();
    assert.equal(env.db.prepare("SELECT COUNT(*) AS total FROM users").get().total, 1);
    assert.equal(env.db.prepare("PRAGMA foreign_keys").get().foreign_keys, 1);
    assert.throws(() => env.db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run("Outra", user.email), /UNIQUE/);
    assert.throws(() => env.db.prepare("INSERT INTO users (email) VALUES (?)").run("semnome@example.com"), /NOT NULL/);
    assert.throws(() => env.db.prepare("INSERT INTO tasks (user_id, title) VALUES (?, ?)").run(999, "Órfã"), /FOREIGN KEY/);
    assert.throws(() => env.db.prepare("INSERT INTO tasks (user_id, title, priority) VALUES (?, ?, ?)").run(user.id, "Teste", "URGENTE"), /CHECK/);
    assert.throws(() => env.db.prepare("INSERT INTO tasks (user_id, title, status) VALUES (?, ?, ?)").run(user.id, "Teste", "FEITA"), /CHECK/);
});

test("Cadastro e login normalizam e-mail e validam campos, duplicidade e senha", async (t) => {
    const env = await setup(t);
    const auth = env.load("src/controllers/authController.js");
    for (const fields of [["", "a@example.com", "1234"], ["Ana", "invalido", "1234"], ["Ana", "a@example.com", ""], ["Ana", "a@example.com", "123"]]) {
        assert.equal((await auth.registerController(...fields)).success, false);
    }
    const user = await createAccount(env, " Ana ", " ANA@EXAMPLE.COM ");
    assert.equal(user.name, "Ana");
    assert.equal(user.email, "ana@example.com");
    assert.equal((await auth.registerController("Outra", user.email, "1234")).success, false);
    assert.equal((await auth.loginController("ANA@example.com", "senha123")).user.id, user.id);
    for (const credentials of [[user.email, "errada"], ["ausente@example.com", "senha123"], ["", ""], [user.email, ""]]) {
        assert.equal((await auth.loginController(...credentials)).success, false);
    }
    assert.equal(env.db.prepare("PRAGMA table_info(users)").all().some((column) => column.name === "password"), false);
});

test("Falha ao gravar credencial desfaz o cadastro", async (t) => {
    const env = await setup(t);
    env.failures.secureWrite = true;
    const result = await env.load("src/controllers/authController.js").registerController("Ana", "ana@example.com", "senha123");
    assert.equal(result.success, false);
    assert.equal(env.db.prepare("SELECT COUNT(*) AS total FROM users").get().total, 0);
});

test("CRUD completo preserva opcionais, prioridade padrão, status e ordenação", async (t) => {
    const env = await setup(t);
    const user = await createAccount(env);
    const tasks = env.load("src/controllers/taskController.js");
    assert.deepEqual((await tasks.getUserTasksController(user.id)).tasks, []);
    let result = await tasks.createTaskController(user.id, " Primeira ");
    assert.equal(result.success, true, result.message);
    assert.equal(result.task.title, "Primeira");
    assert.equal(result.task.description, null);
    assert.equal(result.task.due_date, null);
    assert.equal(result.task.priority, "MEDIA");
    assert.equal(result.task.status, "PENDENTE");
    const id = result.task.id;
    const second = await tasks.createTaskController(user.id, "Segunda", "Detalhes", "25/09/2026", "ALTA");
    assert.equal(second.task.due_date, "2026-09-25");
    assert.equal((await tasks.getUserTasksController(user.id)).tasks[0].id, second.task.id);
    for (const status of ["EM_ANDAMENTO", "CONCLUIDA", "PENDENTE"]) {
        result = await tasks.updateTaskStatusController(id, user.id, status);
        assert.equal(result.task.status, status);
    }
    await tasks.updateTaskStatusController(id, user.id, "CONCLUIDA");
    result = await tasks.updateTaskController(id, user.id, "Editada", " Descrição ", "29/02/2028", "BAIXA");
    assert.equal(result.task.title, "Editada");
    assert.equal(result.task.description, "Descrição");
    assert.equal(result.task.due_date, "2028-02-29");
    assert.equal(result.task.status, "CONCLUIDA");
    result = await tasks.updateTaskController(id, user.id, "Editada", "", "", "MEDIA");
    assert.equal(result.task.due_date, null);
    assert.equal(result.task.description, null);
    assert.equal((await tasks.deleteTaskController(id, user.id)).success, true);
    assert.equal((await tasks.getTaskByIdController(id, user.id)).success, false);
    assert.equal((await tasks.getUserTasksController(user.id)).tasks.length, 1);
});

test("Usuário B não lê, altera status, edita ou exclui tarefas do usuário A", async (t) => {
    const env = await setup(t);
    const a = await createAccount(env);
    const b = await createAccount(env, "Bruno", "bruno@example.com");
    const tasks = env.load("src/controllers/taskController.js");
    const { task } = await tasks.createTaskController(a.id, "Privada");
    assert.deepEqual((await tasks.getUserTasksController(b.id)).tasks, []);
    assert.equal((await tasks.getTaskByIdController(task.id, b.id)).success, false);
    assert.equal((await tasks.updateTaskController(task.id, b.id, "Invadida", "", "", "ALTA")).success, false);
    assert.equal((await tasks.updateTaskStatusController(task.id, b.id, "CONCLUIDA")).success, false);
    assert.equal((await tasks.deleteTaskController(task.id, b.id)).success, false);
    // Confere também a proteção SQL caso o repository seja chamado diretamente.
    const repo = env.load("src/repositories/taskRepository.js");
    await repo.updateTask(task.id, b.id, "Invadida", "", "", "ALTA");
    await repo.updateTaskStatus(task.id, b.id, "CONCLUIDA");
    await repo.deleteTask(task.id, b.id);
    const saved = (await tasks.getTaskByIdController(task.id, a.id)).task;
    assert.equal(saved.title, "Privada");
    assert.equal(saved.status, "PENDENTE");
});

test("Validações impedem título vazio, datas impossíveis, enums e IDs inválidos", async (t) => {
    const env = await setup(t);
    const user = await createAccount(env);
    const tasks = env.load("src/controllers/taskController.js");
    for (const fields of [[" ", "", "", "MEDIA"], ["Teste", "", "31/02/2026", "MEDIA"], ["Teste", "", "", "URGENTE"]]) {
        assert.equal((await tasks.createTaskController(user.id, ...fields)).success, false);
    }
    for (const id of [undefined, null, 0, -1, 1.5, "1", Infinity]) {
        assert.equal((await tasks.getUserTasksController(id)).success, false);
        assert.equal((await tasks.getTaskByIdController(id, user.id)).success, false);
    }
    const { task } = await tasks.createTaskController(user.id, "Original");
    assert.equal((await tasks.updateTaskStatusController(task.id, user.id, "FEITA")).success, false);
    assert.equal((await tasks.updateTaskController(task.id, user.id, "Mudança", "", "29/02/2026", "MEDIA")).success, false);
    assert.equal((await tasks.getTaskByIdController(task.id, user.id)).task.title, "Original");
    assert.equal((await tasks.deleteTaskController(999, user.id)).success, false);
});

test("Entrada com aspas e SQL é armazenada como texto", async (t) => {
    const env = await setup(t);
    const user = await createAccount(env);
    const tasks = env.load("src/controllers/taskController.js");
    const title = "D'água'); DROP TABLE tasks; --";
    const result = await tasks.createTaskController(user.id, title);
    assert.equal(result.task.title, title);
    assert.equal((await tasks.getUserTasksController(user.id)).tasks.length, 1);
});

test("Datas mantêm dia, mês e ano sem depender de fuso horário", async (t) => {
    const env = await setup(t);
    const dates = env.load("src/utils/dateUtils.js");
    assert.equal(dates.formatDateForDatabase("25/09/2026"), "2026-09-25");
    assert.equal(dates.formatDateForDatabase("2026-09-25"), "2026-09-25");
    assert.equal(dates.formatDateForDisplay("2026-09-25"), "25/09/2026");
    assert.equal(dates.formatDateForDatabase("  "), "");
    assert.equal(dates.formatDateForDisplay(null), "");
    for (const value of ["29/02/2026", "31/04/2026", "00/09/2026", "25/13/2026", "25/09/26", "0000-01-01"]) {
        assert.throws(() => dates.formatDateForDatabase(value));
    }
    assert.equal(dates.formatDateForDatabase("29/02/2028"), "2028-02-29");
});

test("Sessão é salva, restaurada, encerrada e rejeita identificadores corrompidos", async (t) => {
    const env = await setup(t);
    const session = env.load("src/services/sessionService.js");
    assert.equal(await session.getSavedSessionUserId(), null);
    await session.saveSession(1);
    assert.equal(await session.getSavedSessionUserId(), 1);
    await session.clearSession();
    assert.equal(await session.getSavedSessionUserId(), null);
    for (const value of ["abc", "0", "-1", "1.5", "Infinity", ""]) {
        env.secureValues.set("session_user_id", value);
        assert.equal(await session.getSavedSessionUserId(), null);
        assert.equal(env.secureValues.has("session_user_id"), false);
    }
});

test("Preferências são independentes por conta e falhas não sobrescrevem valores", async (t) => {
    const env = await setup(t);
    const prefs = env.load("src/services/preferencesService.js");
    assert.equal(await prefs.getShowCompletedTasks(1), true);
    await prefs.saveShowCompletedTasks(1, false);
    assert.equal(await prefs.getShowCompletedTasks(1), false);
    assert.equal(await prefs.getShowCompletedTasks(2), true);
    env.failures.preferencesWrite = true;
    await assert.rejects(prefs.saveShowCompletedTasks(1, true), /salvar/);
    assert.equal(await prefs.getShowCompletedTasks(1), false);
    env.failures.preferencesRead = true;
    await assert.rejects(prefs.getShowCompletedTasks(1), /carregar/);
});

test("Falhas assíncronas são devolvidas como erros pelos controllers", async (t) => {
    const env = await setup(t);
    const user = await createAccount(env);
    env.failures.query = true;
    const result = await env.load("src/controllers/taskController.js").getUserTasksController(user.id);
    assert.equal(result.success, false);
    assert.deepEqual(result.tasks, []);
    assert.match(result.message, /Falha/);
    env.failures.query = false;
    env.failures.secureRead = true;
    assert.equal((await env.load("src/controllers/authController.js").loginController(user.email, "senha123")).success, false);
});

test("Dados SQLite sobrevivem à reabertura e serviços restauram sessão e preferência", async (t) => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), "gerenciador-test-"));
    const filename = path.join(folder, "tasks.db");
    // Remove somente o diretório temporário criado pelo próprio teste.
    t.after(() => {
        assert.equal(path.dirname(path.resolve(folder)), path.resolve(os.tmpdir()));
        assert.ok(path.basename(folder).startsWith("gerenciador-test-"));
        fs.rmSync(folder, { recursive: true, force: true });
    });
    const first = createEnvironment(filename);
    let second;
    try {
        await first.load("src/database/database.js").initializeDatabase();
        const user = await createAccount(first);
        const { task } = await first.load("src/controllers/taskController.js").createTaskController(user.id, "Persistente");
        await first.load("src/services/sessionService.js").saveSession(user.id);
        await first.load("src/services/preferencesService.js").saveShowCompletedTasks(user.id, false);
        first.db.close();
        second = createEnvironment(filename, first.secureValues, first.preferences);
        await second.load("src/database/database.js").initializeDatabase();
        assert.equal(await second.load("src/services/sessionService.js").getSavedSessionUserId(), user.id);
        assert.equal(await second.load("src/services/preferencesService.js").getShowCompletedTasks(user.id), false);
        assert.equal((await second.load("src/controllers/taskController.js").getTaskByIdController(task.id, user.id)).task.title, "Persistente");
    } finally {
        if (first.db.isOpen) first.db.close();
        if (second) second.db.close();
    }
});

test("Banco pode tentar novamente após falha na abertura", async (t) => {
    const env = createEnvironment();
    t.after(() => env.db.close());
    const database = env.load("src/database/database.js");
    env.failures.open = true;
    await assert.rejects(database.initializeDatabase());
    env.failures.open = false;
    await database.initializeDatabase();
    assert.equal(env.db.prepare("SELECT COUNT(*) AS total FROM users").get().total, 0);
});
