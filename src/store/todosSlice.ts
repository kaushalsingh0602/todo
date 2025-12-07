import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { subscribeTodosRTDB, TodoItem, addTodoRTDB, fetchTodosRTDB } from "../services/firestoreService";
import { AppDispatch } from ".";

type TodosState = {
  items: TodoItem[];
  allItems: TodoItem[];
  sortBy: "recent" | "id";
  filter: "all" | "active" | "done";
  loading: boolean;
  loadingMore: boolean;
  page: number;
  pageSize: number;
  hasMore: boolean;
  listenerActive: boolean;
};

const initialState: TodosState = {
  items: [],
  allItems: [],
  sortBy: "recent",
  filter: "all",
  loading: true,
  loadingMore: false,
  page: 1,
  pageSize: 20,
  hasMore: true,
  listenerActive: true,
};

// -------------------- LISTENER --------------------
export const startTodosListener = createAsyncThunk(
  "todos/startListener",
  async (_, { dispatch, getState }) => {
    const state = getState() as any;
    if (!state.todos.listenerActive) return;

    const unsub = subscribeTodosRTDB((list: TodoItem[]) => {
      dispatch(setAllItems(list));
      dispatch(loadPage());
    });

    return unsub;
  }
);

// -------------------- SLICE --------------------
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setAllItems(state, action: PayloadAction<TodoItem[]>) {
      state.allItems = action.payload;
      state.loading = false;
    },
    resetPagination(state) {
      state.page = 1;
      state.items = [];
      state.hasMore = true;
    },
    loadPage(state) {
      const end = state.page * state.pageSize;
      state.items = state.allItems.slice(0, end);
      state.hasMore = end < state.allItems.length;
    },
    loadMore(state) {
      if (!state.hasMore) return;
      const start = state.page * state.pageSize;
      const end = start + state.pageSize;
      const more = state.allItems.slice(start, end);
      state.items = [...state.items, ...more];
      state.page += 1;
      state.hasMore = end < state.allItems.length;
      state.loadingMore = false;
    },
    setSort(state, action: PayloadAction<"recent" | "id">) { state.sortBy = action.payload; },
    setFilter(state, action: PayloadAction<"all" | "active" | "done">) { state.filter = action.payload; },
    setLoadingMore(state, action: PayloadAction<boolean>) { state.loadingMore = action.payload; },
    disableListener(state) { state.listenerActive = false; },
    enableListener(state) { state.listenerActive = true; },
  },
});

export const { setAllItems, loadMore, loadPage, setSort, setFilter, setLoadingMore, resetPagination, disableListener, enableListener } = todosSlice.actions;

export default todosSlice.reducer;

// -------------------- THUNKS --------------------
export const loadMoreTodos = () => (dispatch: AppDispatch, getState: any) => {
  const { todos } = getState();
  if (!todos.hasMore) return;
  dispatch(setLoadingMore(true));
  dispatch(loadMore());
};



// FIRST TIME FETCH + BACKGROUND INSERT
export const fetchInitialTodos = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(disableListener()); // stop listener temporarily

    const existing = await fetchTodosRTDB();
    if (existing.length > 40) {
      dispatch(enableListener());
      dispatch(startTodosListener());
      return;
    }

    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data: TodoItem[] = await res.json();
    const sliced = data.slice(0, 200);

    // show API data immediately in UI
    dispatch(setAllItems(sliced));
    dispatch(loadPage());

    // insert into RTDB in background
    sliced.forEach(async (todo: TodoItem) => {
      await addTodoRTDB(todo.title, todo.completed); // keep completed from API
    });

    // re-enable listener
    setTimeout(() => {
      dispatch(enableListener());
      dispatch(startTodosListener());
    }, 1500);

  } catch (err) {
    console.error("Initial fetch failed", err);
  }
};
