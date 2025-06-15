"use client";
import React, { useState } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Task } from "@/types";
import { TaskModal } from "@/components/kanban/TaskModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <ThemeToggle />
      <main className="container mx-auto px-4 py-6 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          Kanban Board
        </h1>
        <KanbanBoard onTaskClick={handleTaskClick} />
      </main>
      <TaskModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        task={selectedTask || undefined}
      />
    </div>
  );
}
