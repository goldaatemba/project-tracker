import { useState } from 'react';

const initialUsers = [
  {
    id: 1,
    username: 'golda',
    email: 'golda@example.com',
    isAdmin: false,
    isBlocked: false,
  },
  {
    id: 2,
    username: 'alex',
    email: 'alex@example.com',
    isAdmin: false,
    isBlocked: false,
  },
  {
    id: 3,
    username: 'bett',
    email: 'bett@example.com',
    isAdmin: false,
    isBlocked: false,
  },
  {
    id: 4,
    username: 'chris',
    email: 'chris@example.com',
    isAdmin: false,
    isBlocked: false,
  },
  {
    id: 5,
    username: 'golda_updated',
    email: 'golda_new@example.com',
    isAdmin: false,
    isBlocked: false,
  },
  {
    id: 6,
    username: 'golda1',
    email: 'golda1@example.com',
    isAdmin: false,
    isBlocked: false,
  },
  {
    id: 7,
    username: 'susan',
    email: 'susan@example.com',
    isAdmin: true,
    isBlocked: false,
  },
];

const Users = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(initialUsers);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleBlockUser = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
    );
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Search Bar */}
      <div className="my-8">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Search by username or email"
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Username</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Is Admin</th>
            <th className="px-6 py-3">Is Blocked</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.username}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.isAdmin ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4">{user.isBlocked ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleBlockUser(user.id)}
                  className="bg-gray-600 px-4 py-2 font-medium text-white rounded hover:bg-gray-500"
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
