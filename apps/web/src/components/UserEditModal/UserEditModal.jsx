import { useState } from "react";
import { X } from "lucide-react";

export function UserEditModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    display_name: user.display_name || "",
    description: user.description || "",
    role_title: user.role_title || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg max-w-md w-full">
        <div className="bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <input
            type="text"
            placeholder="Display Name"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#66CCFF]"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#66CCFF] h-24"
          />
          <input
            type="text"
            placeholder="Role Title"
            value={formData.role_title}
            onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#66CCFF]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#66CCFF] text-white rounded-lg font-bold hover:bg-[#55BBEE] transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
