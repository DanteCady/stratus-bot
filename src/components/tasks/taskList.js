import useTaskStore from '@/store/taskStore';
import TaskTable from '@/components/tasks/taskTable';

export default function TaskList() {
    const tasks = useTaskStore((state) => state.tasks);
    const deleteTask = useTaskStore((state) => state.deleteTask);

    return (
        <TaskTable tasks={tasks} onDeleteTask={deleteTask} />
    );
}
