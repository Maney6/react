import { useState } from 'react';
import './App.css';

// Component: UserCard
function UserCard({ user, isNew }) {
return (
<div className={`card user-card ${isNew ? 'border-warning border-3' : ''}`}>
{isNew && (
<div className="position-absolute top-0 end-0 m-2">
<span className="badge bg-warning text-dark">
<i className="bi bi-star-fill"></i> New!
</span>
</div>
)}
<div className="card-body text-center">
<div className="user-avatar mx-auto mb-3">
{user.name.charAt(0).toUpperCase()}
</div>
<h5 className="card-title">{user.name}</h5>
<div className="user-info text-start">
<p className="mb-2">
<i className="bi bi-envelope text-primary"></i> {user.email}
</p>
<p className="mb-2">
<i className="bi bi-telephone text-success"></i> {user.phone}
</p>
<p className="mb-2">
<i className="bi bi-geo-alt text-danger"></i>{' '}
{user.address?.city}, {user.address?.street}
</p>
<p className="text-muted small">
<i className="bi bi-hash"></i> ID: {user.id}
</p>
</div>
</div>
</div>
);
}

// Component: UserList
function UserList({ users, newUserId }) {
if (users.length === 0) {
return (
<div className="alert alert-info text-center" role="alert">
<i className="bi bi-info-circle fs-3"></i>
<p className="mt-2 mb-0">No users loaded. Click "Fetch Users" to load data!</p>
</div>
);
}

return (
<div className="row g-4">
{users.map((user) => (
<div key={user.id} className="col-md-6 col-lg-4">
<UserCard user={user} isNew={user.id === newUserId} />
</div>
))}
</div>
);
}

// Component: Add User Form (Bootstrap)
function AddUserForm({ onAddUser, isSubmitting }) {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [city, setCity] = useState('');
const [street, setStreet] = useState('');

const handleSubmit = (e) => {
e.preventDefault();
if (!name || !email || !phone) {
alert('⚠️ Please fill in Name, Email, and Phone');
return;
}

const newUser = {
name,
email,
phone,
address: {
city: city || 'Unknown City',
street: street || 'Unknown Street',
},
};

onAddUser(newUser);

// Clear form
setName('');
setEmail('');
setPhone('');
setCity('');
setStreet('');
};

return (
<div className="card shadow-lg mb-4">
<div className="card-header bg-gradient text-white text-center py-3">
<h4 className="mb-0">
<i className="bi bi-person-plus-fill"></i> Add New User
</h4>
</div>
<div className="card-body p-4">
<form onSubmit={handleSubmit}>
<div className="row g-3">
{/* Name */}
<div className="col-md-6">
<label className="form-label fw-bold">
<i className="bi bi-person"></i> Full Name *
</label>
<input
type="text"
className="form-control form-control-lg"
placeholder="Enter full name"
value={name}
onChange={(e) => setName(e.target.value)}
disabled={isSubmitting}
/>
</div>

{/* Email */}
<div className="col-md-6">
<label className="form-label fw-bold">
<i className="bi bi-envelope"></i> Email Address *
</label>
<input
type="email"
className="form-control form-control-lg"
placeholder="your.email@example.com"
value={email}
onChange={(e) => setEmail(e.target.value)}
disabled={isSubmitting}
/>
</div>

{/* Phone */}
<div className="col-md-6">
<label className="form-label fw-bold">
<i className="bi bi-telephone"></i> Phone Number *
</label>
<input
type="text"
className="form-control form-control-lg"
placeholder="+977-9812345678"
value={phone}
onChange={(e) => setPhone(e.target.value)}
disabled={isSubmitting}
/>
</div>

{/* City */}
<div className="col-md-3">
<label className="form-label fw-bold">
<i className="bi bi-buildings"></i> City
</label>
<input
type="text"
className="form-control form-control-lg"
placeholder="Kathmandu"
value={city}
onChange={(e) => setCity(e.target.value)}
disabled={isSubmitting}
/>
</div>

{/* Street */}
<div className="col-md-3">
<label className="form-label fw-bold">
<i className="bi bi-signpost"></i> Street
</label>
<input
type="text"
className="form-control form-control-lg"
placeholder="Thamel"
value={street}
onChange={(e) => setStreet(e.target.value)}
disabled={isSubmitting}
/>
</div>

{/* Submit Button */}
<div className="col-12">
<button
type="submit"
className="btn btn-primary btn-lg w-100"
disabled={isSubmitting}
>
{isSubmitting ? (
<>
<span className="spinner-border spinner-border-sm me-2"></span>
Adding User...
</>
) : (
<>
<i className="bi bi-plus-circle me-2"></i>
Add User
</>
)}
</button>
</div>
</div>
</form>
</div>
</div>
);
}

// Main App Component
function App() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [newUserId, setNewUserId] = useState(null);
const [dataFetched, setDataFetched] = useState(false);

// Fetch users when button is clicked
const handleFetchUsers = () => {
setLoading(true);

fetch('https://jsonplaceholder.typicode.com/users')
.then((response) => {
if (!response.ok) throw new Error('Failed to fetch');
return response.json();
})
.then((data) => {
setUsers(data);
setLoading(false);
setDataFetched(true);
})
.catch((error) => {
console.error('Error:', error);
alert('Failed to fetch users');
setLoading(false);
});
};

// POST new user
const handleAddUser = (newUser) => {
setIsSubmitting(true);

fetch('https://jsonplaceholder.typicode.com/users', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(newUser),
})
.then((response) => {
if (!response.ok) throw new Error('Failed to create');
return response.json();
})
.then((createdUser) => {
console.log('✅ User created:', createdUser);
setUsers([createdUser, ...users]);
setNewUserId(createdUser.id);
setIsSubmitting(false);

// Show success toast (Bootstrap)
alert(`✅ User "${createdUser.name}" added successfully!`);

setTimeout(() => setNewUserId(null), 4000);
})
.catch((error) => {
console.error('❌ Error:', error);
alert('Failed to add user');
setIsSubmitting(false);
});
};

return (
<div className="app-container">
{/* Header */}
<header className="text-center text-white mb-5 py-4">
<h1 className="display-4 fw-bold">
<i className="bi bi-people-fill"></i> User Directory
</h1>
<p className="lead">Manage users with React + Fetch API + Bootstrap</p>
</header>

<div className="container">
{/* Fetch Button */}
<div className="text-center mb-4">
<button
className="btn btn-success btn-lg px-5 shadow-lg"
onClick={handleFetchUsers}
disabled={loading}
>
{loading ? (
<>
<span className="spinner-border spinner-border-sm me-2"></span>
Loading Users...
</>
) : (
<>
<i className="bi bi-cloud-download me-2"></i>
{dataFetched ? 'Refresh Users' : 'Fetch Users'}
</>
)}
</button>
</div>

{/* Add User Form */}
<AddUserForm onAddUser={handleAddUser} isSubmitting={isSubmitting} />

{/* Users Section */}
<div className="users-section">
<div className="d-flex justify-content-between align-items-center mb-4">
<h2 className="text-white">
<i className="bi bi-list-ul"></i> All Users
</h2>
<span className="badge bg-light text-dark fs-5">
{users.length} Total
</span>
</div>

<UserList users={users} newUserId={newUserId} />
</div>
</div>
</div>
);
}

export default App;