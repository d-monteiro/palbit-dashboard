
import { useEffect, useState } from 'react';
import WaveformGraph from '../components/WaveformGraph';
import {
  generateSineWave,
  generateSquareWave,
  generateTriangleWave,
  calculateFFT
} from '../utils/waveformGenerators';
import Settings from '../components/Settings';

const SAMPLE_COUNT = 256;
const WINDOW_SIZE = 200;
const UPDATE_INTERVAL = 10;

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
      setTime(prevTime => {
        const newTime = prevTime + 1;
        // Adjust the phase calculation to maintain consistent frequency
        const normalizedTime = (newTime * UPDATE_INTERVAL) / 1000; // Convert to seconds
        const phase = normalizedTime * 2 * Math.PI; // Full cycle every second
        
        // Generate new points with consistent frequency
        const newSinePoint = Math.sin(phase);
        const baseSquarePoint = Math.sin(phase) >= 0 ? 1 : -1;
        const noiseAmplitude = 0.1;
        const noise = (Math.random() * 2 - 1) * noiseAmplitude;
        const newSquarePoint = baseSquarePoint + noise;
        const newTrianglePoint = ((newTime % SAMPLE_COUNT) / SAMPLE_COUNT) * 2 - 1;

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
  }, []); // Empty dependency array to prevent re-running the effect

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Settings />
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.palbit.pt" target="_blank" rel="noopener noreferrer">
              <img 
                src="/company-logo.svg" 
                alt="Company Logo" 
                className="h-16 w-48"
              />
            </a>
          </div>
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
