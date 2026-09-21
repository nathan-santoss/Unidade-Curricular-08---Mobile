import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getUserTasksController } from "../controllers/taskController.js";

// Home e lista consultam novamente o banco ao receber foco após uma alteração.
export function useUserTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [revision, setRevision] = useState(0);

    useFocusEffect(useCallback(() => {
        let active = true;
        setLoading(true);
        setError("");
        async function loadTasks() {
            const result = await getUserTasksController(user.id);
            if (!active) return;
            setTasks(result.tasks);
            setError(result.message);
            setLoading(false);
        }
        loadTasks();
        return () => { active = false; };
    }, [user.id, revision]));

    function reload() {
        setRevision((previous) => previous + 1);
    }

    return { tasks, loading, error, reload };
}
