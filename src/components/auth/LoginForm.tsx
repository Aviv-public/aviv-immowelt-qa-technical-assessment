import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSchema } from '../../utils/validation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginWithCredentials = useAuth((s) => s.loginWithCredentials);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await loginWithCredentials(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Invalid email or password';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Test Accounts:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>User: test@example.com / Test123!</li>
          <li>Agent: agent@example.com / Test123!</li>
          <li>Admin: admin@example.com / Test123!</li>
        </ul>
      </div>

      <Input
        label="Email address"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
          Remember me
        </label>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Sign in
      </Button>

      <p className="text-sm text-gray-500 text-center mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700">
          Sign up
        </Link>
      </p>
    </form>
  );
};
