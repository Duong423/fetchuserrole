import React, { useEffect, useState } from "react";

interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
}

const AddRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newRole, setNewRole] = useState({ id: '', code: '', name: '', description: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0dW5nbnRAc29mdGVjaC52biIsImVtYWlsIjoidHVuZ250QHNvZnRlY2gudm4iLCJzdWIiOjEsImFwcGxpY2F0aW9uIjoiT25saW5lIFNob3AgLSBBUEkiLCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiJBZG1pbmlzdHJhdG9ycyJ9LHsiaWQiOjIsIm5hbWUiOiJNYW5hZ2VycyJ9XSwiaWF0IjoxNzUyMDg3MTk1LCJleHAiOjE3ODM2NDQ3OTV9.faZwG9__riyB5qH-x9lVK4GDj3kuyFt6C639FtQ6cok";
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token || ""}`,
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          "https://server.aptech.io/security/roles",
          { headers: defaultHeaders }
        );
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    setAddLoading(true);
    setAddError("");
    try {
      // Validate fields
      if (!newRole.id || !newRole.code || !newRole.name || !newRole.description) {
        setAddError("Vui lòng nhập đầy đủ thông tin!");
        setAddLoading(false);
        return;
      }
      const response = await fetch("https://server.aptech.io/security/roles", {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({
          id: Number(newRole.id),
          code: newRole.code,
          name: newRole.name,
          description: newRole.description,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const added = await response.json();
      setRoles(prev => [...prev, added]);
      setShowDialog(false);
      setNewRole({ id: '', code: '', name: '', description: '' });
    } catch (err: any) {
      setAddError(err.message || "Có lỗi xảy ra!");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách vai trò</h2>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-700">Danh sách vai trò:</div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded shadow"
          onClick={() => setShowDialog(true)}
        >
          Thêm role
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td className="px-3 py-2 text-center">{role.id}</td>
                <td className="px-3 py-2">{role.code}</td>
                <td className="px-3 py-2">{role.name}</td>
                <td className="px-3 py-2">{role.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Dialog thêm role */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Thêm vai trò mới</h3>
            <div className="mb-3">
              <label className="block font-semibold mb-1">ID:</label>
              <input type="number" className="border rounded px-3 py-2 w-full" value={newRole.id} onChange={e => setNewRole(r => ({ ...r, id: e.target.value }))} />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Code:</label>
              <input className="border rounded px-3 py-2 w-full" value={newRole.code} onChange={e => setNewRole(r => ({ ...r, code: e.target.value }))} />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Tên:</label>
              <input className="border rounded px-3 py-2 w-full" value={newRole.name} onChange={e => setNewRole(r => ({ ...r, name: e.target.value }))} />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Mô tả:</label>
              <input className="border rounded px-3 py-2 w-full" value={newRole.description} onChange={e => setNewRole(r => ({ ...r, description: e.target.value }))} />
            </div>
            {addError && <div className="text-red-600 mb-2">{addError}</div>}
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setShowDialog(false)}>Hủy</button>
              <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={handleAddRole} disabled={addLoading}>
                {addLoading ? "Đang thêm..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRoles;
