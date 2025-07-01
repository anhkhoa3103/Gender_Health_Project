import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar.jsx';
import Header from '../components/HeaderManagement.jsx';
import './styles/AdminDashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Package, TestTube, DollarSign
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#4BC0C0'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    overview: null,
    priceDistribution: [],
    packageTestCount: [],
    testUsage: [],
    testPriceRange: [],
    topExpensive: [],
    topPopular: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8080/api/admin/statistics';

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        const [
          overviewRes,
          priceDistRes,
          pkgTestCountRes,
          testUsageRes,
          testPriceRes,
          topExpensiveRes,
          topPopularRes,
          monthlyTrendsRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/overview`),
          fetch(`${API_BASE_URL}/packages/price-distribution`),
          fetch(`${API_BASE_URL}/packages/test-count`),
          fetch(`${API_BASE_URL}/tests/usage`),
          fetch(`${API_BASE_URL}/tests/price-range`),
          fetch(`${API_BASE_URL}/packages/top-expensive?limit=10`),
          fetch(`${API_BASE_URL}/packages/top-popular?limit=10`),
          fetch(`${API_BASE_URL}/monthly-trends`)
        ]);

        setStats({
          overview: await overviewRes.json(),
          priceDistribution: await priceDistRes.json(),
          packageTestCount: await pkgTestCountRes.json(),
          testUsage: await testUsageRes.json(),
          testPriceRange: await testPriceRes.json(),
          topExpensive: await topExpensiveRes.json(),
          topPopular: await topPopularRes.json(),
          monthlyTrends: await monthlyTrendsRes.json()
        });

        setLoading(false);
      } catch (e) {
        console.error('Error fetching statistics:', e);
        // Set sample data for demo when API fails
        setStats({
          overview: {
            totalPackages: 156,
            totalTests: 842,
            averagePackagePrice: 299.99,
            totalValue: 46799.44
          },
          priceDistribution: [
            { priceRange: '$0-100', count: 45 },
            { priceRange: '$100-300', count: 67 },
            { priceRange: '$300-500', count: 32 },
            { priceRange: '$500+', count: 12 }
          ],
          testUsage: [
            { testName: 'Blood Test', usageCount: 234 },
            { testName: 'X-Ray', usageCount: 189 },
            { testName: 'MRI', usageCount: 145 },
            { testName: 'CT Scan', usageCount: 123 },
            { testName: 'Ultrasound', usageCount: 98 }
          ],
          monthlyTrends: [
            { month: 'Jan', packagesCreated: 12, testsAdded: 45 },
            { month: 'Feb', packagesCreated: 18, testsAdded: 52 },
            { month: 'Mar', packagesCreated: 23, testsAdded: 67 },
            { month: 'Apr', packagesCreated: 19, testsAdded: 58 },
            { month: 'May', packagesCreated: 25, testsAdded: 73 },
            { month: 'Jun', packagesCreated: 31, testsAdded: 89 }
          ]
        });
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="dashboard-container">
            <div className="loading">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  const { overview, priceDistribution, testUsage, monthlyTrends } = stats;

  return (
    <div className="admin-dashboard">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2>Admin Dashboard</h2>
            <p className="dashboard-subtitle">Comprehensive analytics and statistics overview</p>
          </div>

          {/* Overview Cards */}
          <div className="dashboard-cards">
            <div className="stat-card">
              <div className="card-icon packages">
                <Package size={24} />
              </div>
              <div className="card-content">
                <h4>Total Packages</h4>
                <p className="stat-number">{overview?.totalPackages || 0}</p>
                
              </div>
            </div>
            
            <div className="stat-card">
              <div className="card-icon tests">
                <TestTube size={24} />
              </div>
              <div className="card-content">
                <h4>Total Tests</h4>
                <p className="stat-number">{overview?.totalTests || 0}</p>
                
              </div>
            </div>
            
            <div className="stat-card">
              <div className="card-icon price">
                <DollarSign size={24} />
              </div>
              <div className="card-content">
                <h4>Avg. Package Price</h4>
                <p className="stat-number">${overview?.averagePackagePrice}</p>
               
              </div>
            </div>
            
            <div className="stat-card">
              <div className="card-icon value">
                <TrendingUp size={24} />
              </div>
              <div className="card-content">
                <h4>Total Value</h4>
                <p className="stat-number">${overview?.totalValue}</p>
                
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Price Distribution */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Package Price Distribution</h3>
                <span className="chart-subtitle">Distribution by price ranges</span>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priceDistribution}
                      dataKey="count"
                      nameKey="priceRange"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({priceRange, percent}) => `${priceRange}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {priceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Test Usage */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Test Usage Statistics</h3>
                <span className="chart-subtitle">Most popular tests</span>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={testUsage} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="testName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="usageCount" 
                      fill="#8884d8" 
                      name="Usage Count" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Monthly Trends</h3>
                <span className="chart-subtitle">Packages and tests growth over time</span>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="packagesCreated" 
                      stroke="#8884d8" 
                      name="Packages Created"
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="testsAdded" 
                      stroke="#82ca9d" 
                      name="Tests Added"
                      strokeWidth={3}
                      dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;