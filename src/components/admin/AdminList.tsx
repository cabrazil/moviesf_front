import React from 'react';
import { Link } from 'react-router-dom';

interface AdminListProps {
  title: string;
  children: React.ReactNode;
  addButtonText?: string;
  addButtonLink?: string;
}

const AdminList: React.FC<AdminListProps> = ({ title, children, addButtonText, addButtonLink }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {addButtonText && addButtonLink && (
          <Link
            to={addButtonLink}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {addButtonText}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
};

export default AdminList; 