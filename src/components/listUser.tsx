import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  fullName: string;
  username: string;
  status: string;
  roles?: Role[];
}

const User: React.FC = () => {
  const [user, setUser] = useState<User[]>([]);
  const navigate = useNavigate();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0dW5nbnRAc29mdGVjaC52biIsImVtYWlsIjoidHVuZ250QHNvZnRlY2gudm4iLCJzdWIiOjEsImFwcGxpY2F0aW9uIjoiT25saW5lIFNob3AgLSBBUEkiLCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiJBZG1pbmlzdHJhdG9ycyJ9LHsiaWQiOjIsIm5hbWUiOiJNYW5hZ2VycyJ9XSwiaWF0IjoxNzUyMDg3MTk1LCJleHAiOjE3ODM2NDQ3OTV9.faZwG9__riyB5qH-x9lVK4GDj3kuyFt6C639FtQ6cok";
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token || ""}`,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://server.aptech.io/security/users",
          { headers: defaultHeaders }
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchUsers();
  }, []);
  const handleEdit = (id: number) => {
    navigate(`/add-roles-user/${id}`);
  };
 
  const handleAddRole = () => {
    navigate('/add-roles');
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-blue-700 drop-shadow">Danh sách Users</h1>
        <button
          onClick={handleAddRole}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow"
        >
          Add Role
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full table-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <th className="px-6 py-3 text-center text-base font-semibold rounded-tl-xl">ID</th>
              <th className="px-6 py-3 text-center text-base font-semibold">Họ tên</th>
              <th className="px-6 py-3 text-center text-base font-semibold">Tên đăng nhập</th>
              <th className="px-6 py-3 text-center text-base font-semibold">Trạng thái</th>
              <th className="px-6 py-3 text-center text-base font-semibold">Vai trò</th>
              <th className="px-6 py-3 text-center text-base font-semibold rounded-tr-xl">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {user?.map((user: User) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50 transition rounded-lg shadow border border-gray-100"
              >
                <td className="px-6 py-3 text-center font-medium">{user.id}</td>
                <td className="px-6 py-3 text-left">{user.fullName}</td>
                <td className="px-6 py-3 text-left">{user.username}</td>
                <td className="px-6 py-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-left">
                  {user.roles && user.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <span key={role.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {role.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Chưa có</span>
                  )}
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-4 rounded shadow transition"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default User;
