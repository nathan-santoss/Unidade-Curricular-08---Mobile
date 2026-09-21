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
