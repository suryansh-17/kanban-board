"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Task, ColumnType, RootState } from "@/types";
import { addTask, updateTask, moveTask } from "@/store/kanbanSlice";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  columnId?: ColumnType;
}

const COLUMN_OPTIONS: ColumnType[] = ["todo", "in-progress", "done"];

const formatColumnLabel = (column: ColumnType) => {
  return column.charAt(0).toUpperCase() + column.slice(1);
};

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  columnId,
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<ColumnType>(
    task?.column || columnId || "todo"
  );

  const currentTask = useSelector((state: RootState) =>
    task ? state.kanban.tasks.find((t: Task) => t.id === task.id) : undefined
  );

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setSelectedColumn(currentTask.column);
    } else {
      setTitle("");
      setDescription("");
      setSelectedColumn(columnId || "todo");
    }
  }, [currentTask, columnId, isOpen]);

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  const handleColumnChange = (value: string) => {
    const newColumn = value as ColumnType;
    setSelectedColumn(newColumn);

    if (currentTask && currentTask.column !== newColumn) {
      dispatch(moveTask({ taskId: currentTask.id, newColumn }));
      toast.success(`Task moved to ${formatColumnLabel(newColumn)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    if (currentTask) {
      dispatch(
        updateTask({
          ...currentTask,
          title,
          description,
          column: selectedColumn,
          updatedAt: now,
        })
      );
      toast.success("Task updated successfully");
    } else if (columnId) {
      const newTask: Task = {
        id: uuidv4(),
        title,
        description,
        column: selectedColumn,
        createdAt: now,
        updatedAt: now,
      };
      dispatch(addTask(newTask));
      toast.success("Task created successfully");
    }
    handleClose();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-[95vw] max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {currentTask ? "Edit Task" : "Add Task"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                required
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                placeholder="Enter task description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={selectedColumn} onValueChange={handleColumnChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>{formatColumnLabel(selectedColumn)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {COLUMN_OPTIONS.map((column) => (
                    <SelectItem key={column} value={column}>
                      {formatColumnLabel(column)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {currentTask && (
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <p>Created: {formatDate(currentTask.createdAt)}</p>
                <p>Last updated: {formatDate(currentTask.updatedAt)}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {currentTask ? "Save Changes" : "Add Task"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
