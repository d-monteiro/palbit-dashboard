import { useEffect, useState } from 'react';
import WaveformGraph from '../components/WaveformGraph';
import {
  generateSineWave,
  generateSquareWave,
  generateTriangleWave,
  calculateFFT
} from '../utils/waveformGenerators';

const SAMPLE_COUNT = 256;
const WINDOW_SIZE = 200; // Number of points to show in the rolling window
const UPDATE_INTERVAL = 10; // ms

const Index = () => {
  const [time, setTime] = useState(0);
  
  const [sineData, setSineData] = useState<number[]>([]);
  const [squareData, setSquareData] = useState<number[]>([]);
  const [triangleData, setTriangleData] = useState<number[]>([]);
  const [fftData, setFftData] = useState<number[]>([]);

  useEffect(() => {
    // Initialize with initial data
    setSineData(generateSineWave(WINDOW_SIZE));
    setSquareData(generateSquareWave(WINDOW_SIZE));
    setTriangleData(generateTriangleWave(WINDOW_SIZE));
    setFftData(calculateFFT(generateSquareWave(WINDOW_SIZE)));

    const interval = setInterval(() => {
      setTime(t => {
        const newTime = t + 1;
        // Adjust the phase calculation to maintain consistent frequency
        const normalizedTime = (newTime * UPDATE_INTERVAL) / 1000; // Convert to seconds
        const phase = normalizedTime * 2 * Math.PI; // Full cycle every second
        
        // Generate new points with consistent frequency
        const newSinePoint = Math.sin(phase);
        const newSquarePoint = Math.sin(phase) >= 0 ? 1 : -1;
        const newTrianglePoint = ((newTime % SAMPLE_COUNT) / SAMPLE_COUNT) * 2 - 1;

        // Update data arrays with rolling window
        setSineData(prev => [...prev.slice(-WINDOW_SIZE + 1), newSinePoint]);
        setSquareData(prev => {
          const newData = [...prev.slice(-WINDOW_SIZE + 1), newSquarePoint];
          setFftData(calculateFFT(newData));
          return newData;
        });
        setTriangleData(prev => [...prev.slice(-WINDOW_SIZE + 1), newTrianglePoint]);
        
        return newTime;
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <a href="https://www.palbit.pt" target="_blank" rel="noopener noreferrer">
            <img 
              src="/company-logo.svg" 
              alt="Company Logo" 
              className="h-16 w-48"
            />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WaveformGraph 
            data={sineData} 
            title="Sine Wave" 
            color="#ea384c"
          />
          <WaveformGraph 
            data={squareData} 
            title="Square Wave" 
            color="#ffffff"
          />
          <WaveformGraph 
            data={triangleData} 
            title="Triangle Wave" 
            color="#888888"
          />
          <WaveformGraph 
            data={fftData} 
            title="Square Wave FFT" 
            color="#ea384c"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;