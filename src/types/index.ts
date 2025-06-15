export type ColumnType = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnType;
  title: string;
  tasks: Task[];
}

export interface KanbanState {
  tasks: Task[];
  columns: Column[];
}

export interface RootState {
  kanban: KanbanState;
}
