import { useEffect, useState } from 'react';
import WaveformGraph from '../components/WaveformGraph';
import {
  generateSineWave,
  generateSquareWave,
  generateTriangleWave,
  calculateFFT
} from '../utils/waveformGenerators';

const SAMPLE_COUNT = 256;
const UPDATE_INTERVAL = 100; // ms

const Index = () => {
  const [time, setTime] = useState(0);
  
  const [sineData, setSineData] = useState(() => generateSineWave(SAMPLE_COUNT));
  const [squareData, setSquareData] = useState(() => generateSquareWave(SAMPLE_COUNT));
  const [triangleData, setTriangleData] = useState(() => generateTriangleWave(SAMPLE_COUNT));
  const [fftData, setFftData] = useState(() => calculateFFT(squareData));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => {
        const newTime = t + 1;
        const phase = newTime * 0.1;
        
        setSineData(generateSineWave(SAMPLE_COUNT, 1 + Math.sin(phase * 0.1)));
        const newSquareData = generateSquareWave(SAMPLE_COUNT, 1 + Math.sin(phase * 0.05));
        setSquareData(newSquareData);
        setTriangleData(generateTriangleWave(SAMPLE_COUNT, 1 + Math.sin(phase * 0.15)));
        setFftData(calculateFFT(newSquareData));
        
        return newTime;
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8">Waveform Analysis Dashboard</h1>
        
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