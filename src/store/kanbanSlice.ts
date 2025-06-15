import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, Column, ColumnType } from "@/types";

export interface KanbanState {
  tasks: Task[];
  columns: Column[];
}

const initialState: KanbanState = {
  tasks: [],
  columns: [
    { id: "todo", title: "Todo", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ],
};

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<KanbanState>) => {
      return action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const newTask = action.payload;
      state.tasks.push(newTask);

      const column = state.columns.find((col) => col.id === newTask.column);
      if (column) {
        column.tasks.push(newTask);
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;
      const taskIndex = state.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );

      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask;

        state.columns.forEach((column) => {
          const columnTaskIndex = column.tasks.findIndex(
            (task) => task.id === updatedTask.id
          );

          if (columnTaskIndex !== -1) {
            if (column.id !== updatedTask.column) {
              column.tasks.splice(columnTaskIndex, 1);
            } else {
              column.tasks[columnTaskIndex] = updatedTask;
            }
          }
        });

        const newColumn = state.columns.find(
          (col) => col.id === updatedTask.column
        );
        if (
          newColumn &&
          !newColumn.tasks.some((task) => task.id === updatedTask.id)
        ) {
          newColumn.tasks.push(updatedTask);
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;

      state.tasks = state.tasks.filter((task) => task.id !== taskId);

      state.columns.forEach((column) => {
        column.tasks = column.tasks.filter((task) => task.id !== taskId);
      });
    },
    moveTask: (
      state,
      action: PayloadAction<{ taskId: string; newColumn: ColumnType }>
    ) => {
      const { taskId, newColumn } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);

      if (task) {
        task.column = newColumn;

        state.columns.forEach((column) => {
          column.tasks = column.tasks.filter((t) => t.id !== taskId);
        });

        const newColumnObj = state.columns.find((col) => col.id === newColumn);
        if (newColumnObj) {
          newColumnObj.tasks.push(task);
        }
      }
    },
    reorderTasks: (
      state,
      action: PayloadAction<{
        columnId: ColumnType;
        sourceIndex: number;
        destinationIndex: number;
      }>
    ) => {
      const { columnId, sourceIndex, destinationIndex } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);

      if (column) {
        const [movedTask] = column.tasks.splice(sourceIndex, 1);
        column.tasks.splice(destinationIndex, 0, movedTask);
      }
    },
    resetBoard: (state) => {
      state.tasks = [];
      state.columns = initialState.columns;
    },
  },
});

export const {
  initialize,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasks,
  resetBoard,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
