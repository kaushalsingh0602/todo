import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../store";
import HeaderControls from "../components/HeaderControls";
import TodoItem from "../components/TodoItem";
import theme from "../styles/theme";

import {
  setFilter,
  setSort,
  startTodosListener,
  fetchInitialTodos,
  loadMoreTodos,
  loadPage,
  resetPagination,
} from "../store/todosSlice";

import { updateTodoRTDB, deleteTodoRTDB } from "../services/firestoreService";

export default function MainScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [uiLoading, setUiLoading] = useState(false);

  const { items, allItems, filter, sortBy, loading, loadingMore, hasMore } =
    useSelector((s: RootState) => s.todos);

  // -------------------- Initial fetch & listener --------------------
  useEffect(() => {
    if (allItems.length === 0) {
      dispatch(fetchInitialTodos());
      dispatch(startTodosListener());
    }
  }, []);

  // -------------------- Filtered + paginated data --------------------
  const filtered = useMemo(() => {
    if (!allItems.length) return [];
    let base = allItems;

    if (filter === "active") base = allItems.filter(t => !t.completed);
    if (filter === "done") base = allItems.filter(t => t.completed);

    return base.slice(0, items.length); // only show loaded pages
  }, [allItems, filter, items.length]);

  const sorted = useMemo(() => {
    if (sortBy === "recent") return filtered;
    return [...filtered].sort((a, b) => a.id.localeCompare(b.id));
  }, [filtered, sortBy]);

  // -------------------- Actions --------------------
  const onToggle = useCallback(async (id: string, completed: boolean) => {
    await updateTodoRTDB(id, { completed: !completed });
  }, []);

  const onDelete = useCallback(async (id: string) => {
    await deleteTodoRTDB(id);
  }, []);

  const onUpdateTitle = useCallback(async (id: string, title: string) => {
    await updateTodoRTDB(id, { title });
  }, []);

  // -------------------- Pagination --------------------
  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    dispatch(loadMoreTodos());
  };

  // -------------------- UI Handlers --------------------
  const handleSort = () => {
    setUiLoading(true);
    dispatch(resetPagination());
    dispatch(setSort(sortBy === "recent" ? "id" : "recent"));
    dispatch(loadPage());
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setUiLoading(false);
  };

  const handleFilter = (f: "all" | "active" | "done") => {
    setUiLoading(true);
    dispatch(resetPagination());
    dispatch(setFilter(f));
    dispatch(loadPage());
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setUiLoading(false);
  };

  const showLoader = (loading || uiLoading) && items.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <HeaderControls
        total={allItems.length}
        done={allItems.filter(i => i.completed).length}
        sortBy={sortBy}
        onToggleSort={handleSort}
        filter={filter}
        setFilter={handleFilter}
        onAdd={() => navigation.navigate("AddTodo" as never)}
      />

      {/* LOADING / EMPTY / LIST */}
      {showLoader ? (
        <View style={styles.inlineLoader}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Loading…</Text>
        </View>
      ) : sorted.length === 0 ? (
        <View style={styles.inlineLoader}>
          <Text style={{ marginTop: 50 }}>No todos available</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={sorted}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TodoItem
              {...item}
              onToggle={() => onToggle(item.id, item.completed)}
              onDelete={() => onDelete(item.id)}
              onUpdateTitle={t => onUpdateTitle(item.id, t)}
            />
          )}
          contentContainerStyle={{ padding: theme.padding }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inlineLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
