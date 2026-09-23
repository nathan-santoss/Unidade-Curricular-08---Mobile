import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getUserTasksController } from "../controllers/taskController.js";

// Compartilho a consulta de tarefas entre a Home e a lista sempre que a tela recebe foco.
export function useUserTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [revision, setRevision] = useState(0);

    // Renovo a consulta ao voltar à tela; useCallback mantém a função até suas dependências mudarem.
    useFocusEffect(useCallback(() => {
        let active = true;
        setLoading(true);
        setError("");
        async function loadTasks() {
            const result = await getUserTasksController(user.id);
            // Ignoro a resposta se a pessoa já saiu desta tela enquanto eu aguardava o banco.
            if (!active) return;
            setTasks(result.tasks);
            setError(result.message);
            setLoading(false);
        }
        loadTasks();
        return () => { active = false; };
    }, [user.id, revision]));

    // Mudo a revisão para disparar outra consulta ao tocar em Tentar novamente.
    function reload() {
        setRevision((previous) => previous + 1);
    }

    return { tasks, loading, error, reload };
}
