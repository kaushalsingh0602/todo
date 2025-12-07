import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { addTodoRTDB } from '../services/firestoreService';
import theme from '../styles/theme';

export default function AddTodoScreen() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);   // <<--- Loader flag
  const navigation = useNavigation();

  const onAdd = useCallback(async () => {
    const title = text.trim();
    if (!title.length) {
      Alert.alert('Validation', 'Please enter a title');
      return;
    }

    try {
      setLoading(true);              // show loader
      await addTodoRTDB(title);      // firebase save
      setText('');
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Failed to add TODO, try again");
    } finally {
      setLoading(false);             // hide loader
    }
  }, [text, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#2563EB', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New TODO</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputCard}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Enter your todo..."
            placeholderTextColor="#94A3B8"
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={onAdd}
          />
        </View>

        {/* ADD BUTTON WITH LOADER */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onAdd}
          style={styles.addBtn}
          disabled={loading}                // disable while loading
        >
          <LinearGradient
            colors={['#1E3A8A', '#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addText}>Add TODO</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.cancelBtn}
          disabled={loading}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#111',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.padding,
    paddingVertical: 16,
  },
  backBtn: { paddingRight: 16},
  backText: { 
  color: '#fff', 
  fontSize: 28,   // bigger arrow
  fontWeight: '700', 
  marginRight: 8, // optional spacing
},

  // backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  body: { 
  flex: 1, 
  padding: 16, 
  justifyContent: 'flex-start', // shift input box a little up
  marginTop: 40, // moves input slightly down from header but higher than center
},

inputCard: {
  backgroundColor: '#FFFFFF',   // white background
  borderWidth: 2,
  borderColor: '#2563EB',       // green border
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 18,
  marginBottom: 22,
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 4,
},

input: {
  color: '#000',                 // black text for visibility
  fontSize: 16,
  paddingVertical: 5,
},


  addBtn: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  gradient: { paddingVertical: 14, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  cancelBtn: {
    borderWidth: 2,
    borderColor: '#F87171',
    backgroundColor: '#F8717133',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: { color: '#F87171', fontWeight: '700', fontSize: 16 },
});
