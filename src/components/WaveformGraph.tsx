import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateMetrics } from '../utils/waveformGenerators';

interface WaveformGraphProps {
  data: number[];
  title: string;
  color?: string;
}

const WaveformGraph = ({ data, title, color = "#ea384c" }: WaveformGraphProps) => {
  const metrics = calculateMetrics(data);
  const chartData = data.map((value, index) => ({ 
    index, 
    value 
  }));

  // Calculate the domain for x-axis to create sliding effect
  const dataLength = chartData.length;
  const xMin = Math.max(0, dataLength - 200); // Show last 200 points
  const xMax = Math.max(200, dataLength); // Ensure we always show at least 200 points

  return (
    <div className="graph-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex gap-4">
          <div className="metric-card bg-gray-900 px-3 py-1 rounded">
            <span className="metric-value text-white">{metrics.max.toFixed(3)}</span>
            <span className="metric-label text-gray-400 text-sm ml-2">Max</span>
          </div>
          <div className="metric-card bg-gray-900 px-3 py-1 rounded">
            <span className="metric-value text-white">{metrics.min.toFixed(3)}</span>
            <span className="metric-label text-gray-400 text-sm ml-2">Min</span>
          </div>
          <div className="metric-card bg-gray-900 px-3 py-1 rounded">
            <span className="metric-value text-white">{metrics.rms.toFixed(3)}</span>
            <span className="metric-label text-gray-400 text-sm ml-2">RMS</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="index" 
            stroke="#666"
            tick={{ fill: '#666' }}
            domain={[xMin, xMax]}
            type="number"
          />
          <YAxis 
            stroke="#666"
            tick={{ fill: '#666' }}
            domain={[-1.5, 1.5]}
            ticks={[-1.5, -1, -0.5, 0, 0.5, 1, 1.5]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '4px',
              color: '#fff'
            }}
            labelStyle={{ color: '#666' }}
            formatter={(value: number) => [value.toFixed(3), 'Value']}
            labelFormatter={(label) => `Sample ${label}`}
            cursor={{ stroke: '#666', strokeWidth: 1 }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaveformGraph;