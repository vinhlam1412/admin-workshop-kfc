import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/AppStore';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { state } = useAppStore();

  // Calculate statistics
  const totalCustomers = state.customerRegistrations.length;
  const totalSlots = state.workshopTimes.reduce((sum, time) => sum + time.totalSlot, 0);
  const remainingSlots = state.workshopTimes.reduce((sum, time) => sum + time.remainSlot, 0);
  const totalSessions = state.workshopTimes.length;

  // Prepare chart data
  const registrationsByDate = state.customerRegistrations.reduce((acc, reg) => {
    const date = reg.workShopDate;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dateChartData = Object.entries(registrationsByDate).map(([date, count]) => ({
    date,
    registrations: count
  }));

  const registrationsByTime = state.customerRegistrations.reduce((acc, reg) => {
    const time = reg.workShopTime;
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const timeChartData = Object.entries(registrationsByTime).map(([time, count]) => ({
    time,
    registrations: count
  }));

  const COLORS = ['#e4002b', '#ffc72c', '#ff6b35', '#4ecdc4'];

  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      description: 'Registered participants',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Remaining Slots',
      value: remainingSlots,
      description: `Out of ${totalSlots} total slots`,
      icon: Calendar,
      color: 'text-secondary'
    },
    {
      title: 'Workshop Sessions',
      value: totalSessions,
      description: 'Active time slots',
      icon: Clock,
      color: 'text-success'
    },
    {
      title: 'Occupancy Rate',
      value: `${Math.round(((totalSlots - remainingSlots) / totalSlots) * 100)}%`,
      description: 'Slots filled',
      icon: TrendingUp,
      color: 'text-warning'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your KFC workshop activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations by Date */}
        <Card>
          <CardHeader>
            <CardTitle>Registrations by Date</CardTitle>
            <CardDescription>Number of registrations per workshop date</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dateChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registrations" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Registrations by Time Slot */}
        <Card>
          <CardHeader>
            <CardTitle>Registrations by Time Slot</CardTitle>
            <CardDescription>Distribution of registrations across time slots</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ time, registrations }) => `${time}: ${registrations}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="registrations"
                >
                  {timeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}