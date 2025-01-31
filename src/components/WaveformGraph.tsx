import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateMetrics } from '../utils/waveformGenerators';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Download, Pause, Play } from 'lucide-react';
import { useState } from 'react';

interface WaveformGraphProps {
  data: number[];
  title: string;
  color?: string;
}

const WaveformGraph = ({ data, title, color = "#ea384c" }: WaveformGraphProps) => {
  const [isFrozen, setIsFrozen] = useState(false);
  const [displayData, setDisplayData] = useState<number[]>([]);

  // Update display data only when not frozen
  if (!isFrozen) {
    setDisplayData(data);
  }

  const metrics = calculateMetrics(displayData);
  const chartData = displayData.map((value, index) => ({ 
    index, 
    value 
  }));

  // Calculate the domain for x-axis to create sliding effect
  const dataLength = chartData.length;
  const xMin = Math.max(0, dataLength - 200); // Show last 200 points
  const xMax = Math.max(200, dataLength); // Ensure we always show at least 200 points

  const handleExport = (seconds: number) => {
    const samplesPerSecond = 100; // Assuming 100Hz sampling rate
    const samplesToExport = seconds * samplesPerSecond;
    const exportData = displayData.slice(-samplesToExport);
    
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Sample,Value\n" + 
      exportData.map((value, index) => `${index},${value}`).join("\n");
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `waveform_${title}_${seconds}s.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="graph-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-4">
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFrozen(!isFrozen)}
              className="h-8 w-8"
            >
              {isFrozen ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport(5)}>
                  Last 5 seconds
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport(10)}>
                  Last 10 seconds
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport(15)}>
                  Last 15 seconds
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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