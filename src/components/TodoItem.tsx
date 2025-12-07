// import React, { useState, useCallback } from 'react';
// import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';

// type Props = {
//   id: string;
//   title: string;
//   completed: boolean;
//   created_at: any;
//   updated_at: any;
//   onToggle: (id: string, completed: boolean) => Promise<void>;
//   onDelete: (id: string) => Promise<void>;
//   onUpdateTitle: (id: string, title: string) => void;
// };

// const TodoItem: React.FC<Props> = ({
//   id,
//   title,
//   completed,
//   created_at,
//   updated_at,
//   onToggle,
//   onDelete,
//   onUpdateTitle
// }) => {

//   const [editing, setEditing] = useState(false);
//   const [value, setValue] = useState(title);

//   const [loadingToggle, setLoadingToggle] = useState(false);
//   const [loadingDelete, setLoadingDelete] = useState(false);

//   // Random color generator
//   const getRandomColor = () => {
//     const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#FF6F91', '#845EC2', '#00C9A7'];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   const cardColor = getRandomColor();
//   const bgColor = `${cardColor}33`; // transparent
//   const borderColor = cardColor;

//   const handleToggle = async () => {
//     setLoadingToggle(true);
//     await onToggle(id, completed);
//     setLoadingToggle(false);
//   };

//   const handleDelete = async () => {
//     setLoadingDelete(true);
//     await onDelete(id);
//   };

//   const save = useCallback(() => {
//     const trimmed = value.trim();
//     if (trimmed.length === 0) return;
//     if (trimmed !== title) onUpdateTitle(id, trimmed);
//     setEditing(false);
//   }, [id, value, title, onUpdateTitle]);

//   return (
//     <View style={[styles.container, { backgroundColor: bgColor, borderColor, shadowColor: borderColor }]}>
      
//       {/* Checkbox */}
//       <TouchableOpacity
//         disabled={loadingToggle}
//         onPress={handleToggle}
//         style={[styles.checkbox, { borderColor }]}
//       >
//         {loadingToggle ? (
//           <ActivityIndicator size="small" color={borderColor} />
//         ) : (
//           <View style={[styles.box, completed && { backgroundColor: borderColor }]}>
//             {completed && <Text style={styles.check}>✓</Text>}
//           </View>
//         )}
//       </TouchableOpacity>

//       {/* Title / Input */}
//       <View style={styles.body}>
//         {editing ? (
//           <TextInput
//             value={value}
//             onChangeText={setValue}
//             onBlur={save}
//             onSubmitEditing={save}
//             style={styles.input}
//             autoFocus
//           />
//         ) : (
//           <TouchableOpacity onLongPress={() => setEditing(true)} activeOpacity={0.8}>
//             <Text style={[styles.title, { color: '#000', textDecorationLine: completed ? 'line-through' : 'none' }]} numberOfLines={2}>
//               {title}
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Delete Button */}
//       <TouchableOpacity
//         style={[styles.delBtn, { backgroundColor: borderColor }]}
//         onPress={handleDelete}
//         disabled={loadingDelete}
//       >
//         {loadingDelete ? (
//           <ActivityIndicator color="#fff" size="small" />
//         ) : (
//           <Text style={styles.delText}>Delete</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderWidth: 2,
//     borderRadius: 12,
//     marginVertical: 6,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   checkbox: {
//     borderWidth: 2,
//     borderRadius: 4,
//     width: 20,
//     height: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   box: {
//     width: 16,
//     height: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   check: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 12,
//   },
//   body: { flex: 1, paddingHorizontal: 10 },
//   title: { fontSize: 16, fontWeight: '500' },
//   delBtn: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   delText: { color: '#fff', fontWeight: '600' },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: '#000',
//     paddingVertical: 2,
//     fontSize: 16,
//     color: '#000',
//   },
// });

// export default React.memo(TodoItem);



import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';

type Props = {
  id: string;
  title: string;
  completed: boolean;
  created_at: any;
  updated_at: any;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdateTitle: (id: string, title: string) => void;
};

const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  created_at,
  updated_at,
  onToggle,
  onDelete,
  onUpdateTitle
}) => {

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);

  // local state for optimistic UI
  const [localCompleted, setLocalCompleted] = useState(completed);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Random color generator
  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#FF6F91', '#845EC2', '#00C9A7'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const cardColor = getRandomColor();
  const bgColor = `${cardColor}33`;
  const borderColor = cardColor;

  const handleToggle = async () => {
    const newStatus = !localCompleted;
    setLocalCompleted(newStatus); // update UI instantly
    onToggle(id, completed); // call api in background without waiting
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    await onDelete(id);
  };

  const save = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    if (trimmed !== title) onUpdateTitle(id, trimmed);
    setEditing(false);
  }, [id, value, title, onUpdateTitle]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor, shadowColor: borderColor }]}>
      
      {/* Checkbox */}
      <TouchableOpacity onPress={handleToggle} style={[styles.checkbox, { borderColor }]}>
        <View style={[styles.box, localCompleted && { backgroundColor: borderColor }]}>
          {localCompleted && <Text style={styles.check}>✓</Text>}
        </View>
      </TouchableOpacity>

      {/* Title / Input */}
      <View style={styles.body}>
        {editing ? (
          <TextInput
            value={value}
            onChangeText={setValue}
            onBlur={save}
            onSubmitEditing={save}
            style={styles.input}
            autoFocus
          />
        ) : (
          <TouchableOpacity onLongPress={() => setEditing(true)} activeOpacity={0.8}>
            <Text style={[styles.title, { color: '#000', textDecorationLine: localCompleted ? 'line-through' : 'none' }]} numberOfLines={2}>
              {title}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={[styles.delBtn, { backgroundColor: borderColor }]}
        onPress={handleDelete}
        disabled={loadingDelete}
      >
        {loadingDelete ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.delText}>Delete</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
    marginVertical: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  checkbox: {
    borderWidth: 2,
    borderRadius: 4,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  body: { flex: 1, paddingHorizontal: 10 },
  title: { fontSize: 16, fontWeight: '500' },
  delBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  delText: { color: '#fff', fontWeight: '600' },
  input: {
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingVertical: 2,
    fontSize: 16,
    color: '#000',
  },
});

export default React.memo(TodoItem);
