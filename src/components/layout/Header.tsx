import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogIn, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserMenu } from './UserMenu';

export const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm" data-testid="header">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RealEstate</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/properties" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                Properties
              </Link>
              <Link to="/agents" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                Agents
              </Link>
              <Link to="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                <Info className="w-4 h-4 mr-1" />
                About Demo
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="ml-4">
                <UserMenu />
              </div>
            ) : (
              <Link to="/login" className="ml-4 flex items-center text-gray-500 hover:text-gray-900">
                <LogIn className="h-5 w-5" />
                <span className="ml-2">Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};