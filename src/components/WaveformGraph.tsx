
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
import { useState, useEffect } from 'react';

interface WaveformGraphProps {
  data: number[];
  title: string;
  color?: string;
}

const WaveformGraph = ({ data, title, color = "#ea384c" }: WaveformGraphProps) => {
  const [isFrozen, setIsFrozen] = useState(false);
  const [displayData, setDisplayData] = useState<number[]>([]);

  // Update display data only when not frozen
  useEffect(() => {
    if (!isFrozen) {
      setDisplayData(data);
    }
  }, [data, isFrozen]);

  const metrics = calculateMetrics(displayData);
  const isFFT = title.includes('FFT');
  const samplingRate = 100; // 100Hz sampling rate

  const chartData = displayData.map((value, index) => {
    // For FFT, index represents frequency bins
    // For time domain signals, convert index to time in seconds
    const xValue = isFFT ? index : -(displayData.length - index) / samplingRate;
    return { 
      x: xValue, 
      value 
    };
  });

  // Calculate the domain for x-axis
  const dataLength = chartData.length;
  const timeWindow = dataLength / samplingRate; // Window size in seconds
  const xMin = isFFT ? 0 : -timeWindow;
  const xMax = isFFT ? dataLength : 0;

  // Define fixed ticks for Y axis
  const yTicks = [-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5];

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
      <ResponsiveContainer width="100%" height="70%">
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="x" 
            stroke="#666"
            tick={{ fill: '#666' }}
            domain={[xMin, xMax]}
            type="number"
            tickFormatter={(value) => isFFT ? value.toString() : value.toFixed(1)}
            label={{ value: isFFT ? 'Frequency (Hz)' : 'Time (s)', position: 'insideBottom', offset: -5, fill: '#666' }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fill: '#666' }}
            domain={isFFT ? [0, 1] : [-1.5, 1.5]}
            ticks={isFFT ? [0, 0.25, 0.5, 0.75, 1] : yTicks}
            scale="linear"
            interval={0}
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
            labelFormatter={(label) => isFFT ? `Frequency: ${label} Hz` : `Time: ${label.toFixed(2)}s`}
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
