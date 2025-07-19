import React, { useEffect, useState } from "react";

interface Role {
  id: number;
  name: string;
}

interface EditRoleProps {
  userId: number;
}

const EditRole: React.FC<EditRoleProps> = ({ userId }) => {

    
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
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

  const handleRoleChange = (roleId: number) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleUpdateRoles = async () => {
    if (selectedRoles.length === 0) {
      setError("Bạn phải chọn ít nhất một vai trò!");
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      const response = await fetch(
        `https://server.aptech.io/security/users/${userId}/add-roles-to-user`,
        {
          method: "PUT",
          headers: defaultHeaders,
          body: JSON.stringify({ role_ids: selectedRoles }), 
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cập nhật vai trò thất bại! ${errorText}`);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa vai trò cho User #{userId}</h2>
      <div className="mb-6">
        <div className="font-semibold text-gray-700 mb-2">Chọn vai trò:</div>
        <div className="flex flex-wrap gap-4">
          {roles.map(role => (
            <label key={role.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.id)}
                onChange={() => handleRoleChange(role.id)}
                className="accent-blue-600"
              />
              <span>{role.name}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={handleUpdateRoles}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition disabled:opacity-50"
      >
        {loading ? "Đang cập nhật..." : "Cập nhật vai trò"}
      </button>
      {success && <div className="text-green-600 mt-4 font-semibold">Cập nhật thành công!</div>}
      {error && <div className="text-red-600 mt-4 font-semibold">{error}</div>}
    </div>
  );
};

export default EditRole;
