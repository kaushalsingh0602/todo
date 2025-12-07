import database from '@react-native-firebase/database';
import DeviceInfo from 'react-native-device-info';

export type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  created_at: number;
  updated_at: number;
};

// Get device ID as user ID
export const getUserId = async (): Promise<string> => {
  const deviceId = DeviceInfo.getUniqueId(); // e.g., "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
  return deviceId;
};

// Add Todo
export const addTodoRTDB = async (title: string, completed = false) => {
  const userId = await getUserId();
  const ref = database().ref(`todos/${userId}`).push();

  await ref.set({
    id: ref.key,
    title,
    completed,
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return ref.key;
};

// Fetch Todos (once)
export const fetchTodosRTDB = async (): Promise<TodoItem[]> => {
  const userId = await getUserId();
  const snapshot = await database().ref(`todos/${userId}`).once('value');
  const val = snapshot.val() || {};
  return Object.values(val);
};

// Subscribe to realtime updates
export const subscribeTodosRTDB = (callback: (todos: TodoItem[]) => void) => {
  let unsub: () => void = () => {};

  getUserId().then(userId => {
    const ref = database().ref(`todos/${userId}`);
    ref.on('value', snapshot => {
      const val = snapshot.val() || {};
      callback(Object.values(val));
    });

    unsub = () => ref.off('value');
  });

  return () => unsub(); // now subscribeTodosRTDB returns a function
};


// Update Todo
export const updateTodoRTDB = async (id: string, data: Partial<TodoItem>) => {
  const userId = await getUserId();
  await database().ref(`todos/${userId}/${id}`).update({
    ...data,
    updated_at: Date.now(),
  });
};

// Delete Todo
export const deleteTodoRTDB = async (id: string) => {
  const userId = await getUserId();
  await database().ref(`todos/${userId}/${id}`).remove();
};
