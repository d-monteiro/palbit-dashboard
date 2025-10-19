
export const generateSineWave = (length: number, frequency: number = 1): number[] => {
  return Array.from({ length }, (_, i) => 
    Math.sin(2 * Math.PI * frequency * i / length)
  );
};

export const generateSquareWave = (length: number, frequency: number = 1): number[] => {
  // Add random noise with amplitude of 0.1 (10% of signal)
  const noiseAmplitude = 0.1;
  return Array.from({ length }, (_, i) => {
    const baseSignal = Math.sin(2 * Math.PI * frequency * i / length) >= 0 ? 1 : -1;
    const noise = (Math.random() * 2 - 1) * noiseAmplitude; // Random value between -0.1 and 0.1
    return baseSignal + noise;
  });
};

export const generateTriangleWave = (length: number, frequency: number = 1): number[] => {
  return Array.from({ length }, (_, i) => {
    const t = (i % (length / frequency)) / (length / frequency);
    return t < 0.5 ? 4 * t - 1 : -4 * t + 3;
  });
};

export const calculateFFT = (data: number[]): number[] => {
  const fft = data.map((val, i) => {
    let real = 0;
    let imag = 0;
    for (let t = 0; t < data.length; t++) {
      const angle = (2 * Math.PI * t * i) / data.length;
      real += data[t] * Math.cos(angle);
      imag -= data[t] * Math.sin(angle);
    }
    return Math.sqrt(real * real + imag * imag) / data.length;
  });
  return fft.slice(0, data.length / 2);
};

export const calculateMetrics = (data: number[]) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const rms = Math.sqrt(data.reduce((acc, val) => acc + val * val, 0) / data.length);
  
  return { max, min, rms };
};
