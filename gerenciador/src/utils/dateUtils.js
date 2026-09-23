// Interpreto a data no calendário local para evitar uma mudança de dia por causa do fuso.
export function formatDateForDatabase(value) {
    const text = value.trim();
    if (text === "") return "";

    let year;
    let month;
    let day;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
        [day, month, year] = text.split("/").map(Number);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        [year, month, day] = text.split("-").map(Number);
    } else {
        throw new Error("Informe a data no formato DD/MM/AAAA.");
    }

    // Subtraio um do mês porque o JavaScript conta janeiro como zero.
    const date = new Date(year, month - 1, day);
    // Comparo as partes porque Date ajusta datas impossíveis, como 31 de fevereiro.
    if (year < 1000 || year > 9999 || date.getFullYear() !== year ||
        date.getMonth() !== month - 1 || date.getDate() !== day) {
        throw new Error("Informe uma data válida.");
    }

    // Completo mês e dia com zero para manter o formato AAAA-MM-DD no banco.
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Inverto a ordem das partes para apresentar a data como DD/MM/AAAA.
export function formatDateForDisplay(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

// Aceito o campo vazio ou um horário de 24 horas, sempre com dois dígitos por parte.
export function formatTimeForDatabase(value = "") {
    const time = value.trim();
    if (time === "") return "";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
        throw new Error("Informe um horário válido no formato HH:MM (00:00 a 23:59).");
    }
    return time;
}

// Combino data e horário no fuso do aparelho para definir o instante do lembrete.
export function getTaskDateTime(date, time) {
    if (!date || !time) return null;
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const result = new Date(year, month - 1, day, hour, minute);
    // Detecto ajustes automáticos, inclusive horários que não existem por mudança de fuso.
    if (result.getHours() !== hour || result.getMinutes() !== minute ||
        result.getDate() !== day || result.getMonth() !== month - 1 || result.getFullYear() !== year) {
        throw new Error("Esse horário não existe na data escolhida no fuso do dispositivo.");
    }
    return result;
}

// Uso a mesma descrição de prazo nos cartões e nos detalhes da tarefa.
export function formatTaskDeadline(task) {
    if (!task.due_date) return "Sem data limite";
    let text = formatDateForDisplay(task.due_date);
    if (task.due_time) text += ` às ${task.due_time}`;
    return text;
}
