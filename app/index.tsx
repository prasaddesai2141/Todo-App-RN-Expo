import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  if (isLoaded) {
    saveTodos();
  }
}, [todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  const saveTodos = async () => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", jsonValue);
    } catch (e) {
      console.log("Error saving todos", e);
    }
  };

 const loadTodos = async () => {
  try {
    const value = await AsyncStorage.getItem("todos");
    if (value !== null) {
      setTodos(JSON.parse(value));
    }
  } catch (e) {
    console.log("Error loading todos", e);
  } finally {
    setIsLoaded(true);
  }
};

  const addTodo = () => {
    if (task.trim() === "") return;

    setTodos([...todos, task]);
    setTask("");
  };

  const deleteTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Todo App</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter a task"
          style={styles.input}
          value={task}
          onChangeText={setTask}
        />

        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.todoRow}>
            <Text style={styles.todoItem}>{item}</Text>

            <Pressable onPress={() => deleteTodo(index)}>
              <Text style={styles.deleteText}>🗑</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No Todos Yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginRight: 10,
  },
  todoItem: {
  fontSize: 18,
},
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  todoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
  },

  deleteText: {
    fontSize: 18,
  },
});
