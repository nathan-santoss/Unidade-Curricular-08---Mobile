// Valida o calendário sem converter a data para UTC (evita mudança de dia no iPhone).
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

    const date = new Date(year, month - 1, day);
    if (year < 1000 || year > 9999 || date.getFullYear() !== year ||
        date.getMonth() !== month - 1 || date.getDate() !== day) {
        throw new Error("Informe uma data válida.");
    }

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatDateForDisplay(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
}

export function formatTimeForDatabase(value = "") {
    const time = value.trim();
    if (time === "") return "";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
        throw new Error("Informe um horário válido no formato HH:MM (00:00 a 23:59).");
    }
    return time;
}

// Combina data e horário no fuso local; não interpreta a data como UTC.
export function getTaskDateTime(date, time) {
    if (!date || !time) return null;
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const result = new Date(year, month - 1, day, hour, minute);
    if (result.getHours() !== hour || result.getMinutes() !== minute ||
        result.getDate() !== day || result.getMonth() !== month - 1 || result.getFullYear() !== year) {
        throw new Error("Esse horário não existe na data escolhida no fuso do dispositivo.");
    }
    return result;
}

export function formatTaskDeadline(task) {
    if (!task.due_date) return "Sem data limite";
    let text = formatDateForDisplay(task.due_date);
    if (task.due_time) text += ` às ${task.due_time}`;
    return text;
}
