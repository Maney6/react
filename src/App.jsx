import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Create Theme Context
const ThemeContext = createContext();

// Component: UserCard
function UserCard({ user }) {
  const { theme, fontSize } = useContext(ThemeContext);
  return (
    <div
      className={`border p-4 m-2 rounded-lg shadow-md transition-all duration-300 ${
        theme === 'light'
          ? 'bg-green-50 text-green-900'
          : 'bg-teal-900 text-white'
      }`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <h3 className="font-bold">{user.name}</h3>
      <p className="text-sm">{user.email}</p>
      <p className="text-xs">
        {user.address.city}, {user.address.street}
      </p>
      <p className="text-xs mt-1">Phone: {user.phone}</p>
    </div>
  );
}

// Component: UserList
function UserList({ users }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Main App Component
function App() {
  const [theme, setTheme] = useState('light'); // setting theme
  const [users, setUsers] = useState([]); // fetching users api
  const [loading, setLoading] = useState(true); // spinning flag
  const [fontSize, setFontSize] = useState(16); // base px size

  // Fetch users from JSONPlaceholder API using axios
  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      <div
        className={
          theme === 'light'
            ? 'bg-green-100 p-6 min-h-screen'
            : 'bg-teal-800 p-6 text-white min-h-screen'
        }
      >
        <h1 className="text-4xl font-bold mb-6">React Demo: Users Directory</h1>
        <div className="mb-6 flex space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Toggle Theme
          </button>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
            onClick={() => setFontSize(fontSize + 2)}
          >
            Increase Font Size
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => setFontSize(fontSize > 12 ? fontSize - 2 : fontSize)}
          >
            Decrease Font Size
          </button>
        </div>
        {loading ? (
          <p className="text-xl">Loading users...</p>
        ) : (
          <UserList users={users} />
        )}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
