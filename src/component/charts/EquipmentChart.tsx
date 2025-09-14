import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface EquipmentChartProps {
  efficiencyData: Array<{
    name: string;
    efficiency: number;
    fill: string;
  }>;
  statusData: Array<{
    equipment: string;
    running: number;
    maintenance: number;
    breakdown: number;
  }>;
}

const EquipmentChart: React.FC<EquipmentChartProps> = ({ efficiencyData, statusData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">설비 현황</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 방사형 차트 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">설비별 가동률</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={efficiencyData}>
                <RadialBar dataKey="efficiency" cornerRadius={4} fill="#3B82F6" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number) => [`${value}%`, '가동률']}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1">
            {efficiencyData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded mr-2" 
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.efficiency}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 바 차트 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">설비 상태별 현황</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  type="category"
                  dataKey="equipment"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="running" stackId="a" fill="#10B981" radius={[0, 2, 2, 0]} />
                <Bar dataKey="maintenance" stackId="a" fill="#F59E0B" radius={[0, 2, 2, 0]} />
                <Bar dataKey="breakdown" stackId="a" fill="#EF4444" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-xs text-gray-600">가동중</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span className="text-xs text-gray-600">점검중</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-xs text-gray-600">고장</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentChart;
