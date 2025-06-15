"use client";

import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  moveTask,
  updateTask,
  deleteTask,
  resetBoard,
} from "@/store/kanbanSlice";
import { Task, ColumnType } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { TaskModal } from "./TaskModal";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskClick }) => {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.kanban.columns);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnType | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<ColumnType | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);
  const columnRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    task: Task
  ) => {
    e.preventDefault();
    touchTimeoutRef.current = setTimeout(() => {
      setDraggedTask(task);
      setIsDragging(true);
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }, 300);
  };

  const getColumnFromTouch = (
    clientX: number,
    clientY: number
  ): ColumnType | null => {
    for (const [columnId, ref] of Object.entries(columnRefs.current)) {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          return columnId as ColumnType;
        }
      }
    }
    return null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedTask) return;

    e.preventDefault();
    const touch = e.touches[0];
    const targetColumn = getColumnFromTouch(touch.clientX, touch.clientY);

    setDragOverColumn(targetColumn);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }

    if (isDragging && draggedTask && dragOverColumn) {
      if (draggedTask.column !== dragOverColumn) {
        dispatch(
          moveTask({ taskId: draggedTask.id, newColumn: dragOverColumn })
        );
      }
    }

    // Reset states
    setDraggedTask(null);
    setDragOverColumn(null);
    setIsDragging(false);
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  const handleTouchCancel = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
    setIsDragging(false);
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumn: ColumnType
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    dispatch(moveTask({ taskId, newColumn: targetColumn }));
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleEditSubmit = (task: Task) => {
    if (editTitle.trim() && editTitle !== task.title) {
      dispatch(
        updateTask({
          ...task,
          title: editTitle,
          updatedAt: new Date().toISOString(),
        })
      );
    }
    setEditingTaskId(null);
    setEditTitle("");
  };

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
    toast.success("Task deleted successfully");
  };

  const handleAddTask = (columnId: ColumnType) => {
    setSelectedColumnId(columnId);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedColumnId(null);
  };

  const handleResetBoard = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the board? This will delete all tasks."
      )
    ) {
      dispatch(resetBoard());
      toast.success("Board has been reset");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4 px-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
          onClick={handleResetBoard}
        >
          <RotateCcw className="h-4 w-4" />
          Reset Board
        </Button>
      </div>
      <div
        className="flex flex-col lg:flex-row gap-6 p-4 h-full"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {columns.map((column) => (
          <motion.div
            key={column.id}
            ref={(el) => {
              columnRefs.current[column.id] = el;
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={clsx(
              "flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 min-h-[500px] transition-all duration-300 border-2 border-transparent backdrop-blur-sm",
              dragOverColumn === column.id &&
                "border-blue-400 bg-blue-50/50 dark:bg-blue-950/50 shadow-lg",
              "w-full lg:w-auto"
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {column.title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                onClick={() => handleAddTask(column.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {column.tasks.map((task) => {
                  const isEditing = editingTaskId === task.id;
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, task)}
                      onTouchStart={(e) => handleTouchStart(e as any, task)}
                      onClick={() => !isEditing && onTaskClick(task)}
                      className={clsx(
                        "relative bg-white dark:bg-gray-700/80 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 flex items-center group backdrop-blur-sm",
                        draggedTask?.id === task.id &&
                          "scale-105 shadow-lg border-2 border-blue-400 z-10",
                        isDragging &&
                          draggedTask?.id !== task.id &&
                          "pointer-events-none"
                      )}
                      style={{ userSelect: isEditing ? "text" : "none" }}
                    >
                      {isEditing ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditSubmit(task);
                          }}
                          className="flex-1 flex items-center gap-2"
                        >
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={handleEditChange}
                            onBlur={() => handleEditSubmit(task)}
                            className="flex-1 bg-transparent border-b border-blue-400 outline-none text-base px-1 py-0.5"
                          />
                        </form>
                      ) : (
                        <>
                          <h3
                            className="font-medium flex-1 text-gray-800 dark:text-gray-200"
                            onDoubleClick={() => handleEdit(task)}
                          >
                            {task.title}
                          </h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(task);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(task.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        columnId={selectedColumnId || undefined}
      />
    </>
  );
};
