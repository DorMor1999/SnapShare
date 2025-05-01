import React from 'react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">An Error Occurred</h2>
        <p className="mb-4 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
