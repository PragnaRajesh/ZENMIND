import React, { useState } from 'react';
import {
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { mentalHealthStats } from '../data/statistics';
import { statisticsDescriptions } from '../data/statisticsDescriptions';
import { BarChart2, TrendingUp, Users, Brain, Info } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

export const Statistics: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleBarClick = (data: any) => {
    setSelectedRegion(data.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mental Health Statistics</h1>
          <p className="text-lg text-gray-600">
            Understanding the impact of workplace stress in major tech hubs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regional Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3">Cases by Region</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mentalHealthStats.regions} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8b5cf6" name="Reported Cases" />
              </BarChart>
            </ResponsiveContainer>
            {selectedRegion && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Info className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-purple-900">{selectedRegion} Insights</h3>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {statisticsDescriptions.regions[selectedRegion as keyof typeof statisticsDescriptions.regions].details}
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-900">Key Factors:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                    {statisticsDescriptions.regions[selectedRegion as keyof typeof statisticsDescriptions.regions].factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Condition Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Brain className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3">Condition Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mentalHealthStats.conditions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {mentalHealthStats.conditions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Work-Related Factors */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3">Work-Related Factors</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mentalHealthStats.workRelatedFactors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mentalHealthStats.workRelatedFactors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Trends */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold ml-3">Yearly Trends</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mentalHealthStats.yearlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cases"
                  stroke="#8b5cf6"
                  name="Total Cases"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">{statisticsDescriptions.trends.overview}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-900">Key Findings:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                  {statisticsDescriptions.trends.keyFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              High concentration of cases in major tech hubs due to intense work pressure
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
              Anxiety remains the most prevalent condition among tech workers
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Work overload is the leading contributor to mental health issues
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Steady increase in reported cases over the past 5 years
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};