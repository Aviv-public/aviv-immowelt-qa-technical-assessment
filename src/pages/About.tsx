import { User, Key } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About This Demo</h1>
        <p className="text-xl text-gray-600">
          A real estate platform built to showcase full-stack development capabilities
        </p>
      </div>

      {/* Test Credentials Section - Moved to top for better visibility */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Key className="w-6 h-6 mr-2 text-blue-600" />
          Test Credentials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg bg-blue-50">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold">Regular User Account</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600 font-medium">Email:</p>
                <p className="text-sm font-mono">test@example.com</p>
              </div>
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600 font-medium">Password:</p>
                <p className="text-sm font-mono">Test123!</p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-green-50">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="font-semibold">Agent Account</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600 font-medium">Email:</p>
                <p className="text-sm font-mono">agent@example.com</p>
              </div>
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600 font-medium">Password:</p>
                <p className="text-sm font-mono">Test123!</p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-purple-50">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="font-semibold">Admin Account</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600 font-medium">Email:</p>
                <p className="text-sm font-mono">admin@example.com</p>
              </div>
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600 font-medium">Password:</p>
                <p className="text-sm font-mono">Test123!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};