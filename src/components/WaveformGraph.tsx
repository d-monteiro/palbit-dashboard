import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { calculateMetrics } from '../utils/waveformGenerators';

interface WaveformGraphProps {
  data: number[];
  title: string;
  color?: string;
}

const WaveformGraph = ({ data, title, color = "#ea384c" }: WaveformGraphProps) => {
  const metrics = calculateMetrics(data);
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div className="graph-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-4">
          <div className="metric-card">
            <span className="metric-value">{metrics.max.toFixed(3)}</span>
            <span className="metric-label">Max</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{metrics.min.toFixed(3)}</span>
            <span className="metric-label">Min</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{metrics.rms.toFixed(3)}</span>
            <span className="metric-label">RMS</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="index" 
            stroke="#666"
            tick={{ fill: '#666' }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fill: '#666' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaveformGraph;