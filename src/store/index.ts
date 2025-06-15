import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from "./kanbanSlice";
import { KanbanState } from "./kanbanSlice";

export const store = configureStore({
  reducer: {
    kanban: kanbanReducer,
  },
});

if (typeof window !== "undefined") {
  const loadState = () => {
    try {
      const serializedState = localStorage.getItem("kanbanState");
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error("Error loading state from localStorage:", err);
      return undefined;
    }
  };

  const persistedState = loadState();
  if (persistedState) {
    store.dispatch({
      type: "kanban/initialize",
      payload: persistedState.kanban,
    });
  }

  store.subscribe(() => {
    try {
      const serializedState = JSON.stringify(store.getState());
      localStorage.setItem("kanbanState", serializedState);
    } catch (err) {
      console.error("Error saving state to localStorage:", err);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
