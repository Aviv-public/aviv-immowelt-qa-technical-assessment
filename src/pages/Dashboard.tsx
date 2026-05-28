import { useAuth } from '../hooks/useAuth';
import { AgentDashboard } from '../components/dashboard/AgentDashboard';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const dashboardComponents = {
    agent: AgentDashboard,
    user: UserDashboard,
    admin: AdminDashboard,
  };

  const DashboardComponent = dashboardComponents[user.role];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardComponent />
    </div>
  );
};