export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  correlation: number;
  stdErrorSlope: number;
  xMean: number;
  yMean: number;
  predict: (x: number) => number;
}

/**
 * Calculates Ordinary Least Squares (OLS) linear regression: y = m*x + c
 */
export function calculateLinearRegression(points: Array<{ x: number; y: number }>): LinearRegressionResult | null {
  const n = points.length;
  if (n < 2) return null;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const pt of points) {
    sumX += pt.x;
    sumY += pt.y;
    sumXY += pt.x * pt.y;
    sumX2 += pt.x * pt.x;
    sumY2 += pt.y * pt.y;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (Math.abs(denominator) < 1e-15) {
    return null;
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY * sumX2 - sumX * sumXY) / denominator;

  const xMean = sumX / n;
  const yMean = sumY / n;

  // Compute Pearson Correlation and R²
  const ssTotal = sumY2 - (sumY * sumY) / n;
  let ssResidual = 0;
  for (const pt of points) {
    const predictedY = slope * pt.x + intercept;
    ssResidual += Math.pow(pt.y - predictedY, 2);
  }

  const r2 = ssTotal !== 0 ? Math.max(0, Math.min(1, 1 - ssResidual / ssTotal)) : 1;
  const correlation = (n * sumXY - sumX * sumY) / Math.sqrt(denominator * (n * sumY2 - sumY * sumY) || 1);

  // Standard error of the slope
  const sResidualVariance = n > 2 ? ssResidual / (n - 2) : 0;
  const stdErrorSlope = Math.sqrt(sResidualVariance / (sumX2 - (sumX * sumX) / n) || 0);

  return {
    slope,
    intercept,
    r2,
    correlation,
    stdErrorSlope,
    xMean,
    yMean,
    predict: (x: number) => slope * x + intercept,
  };
}

/**
 * Calculates sample mean, sample standard deviation, and standard error of mean
 */
export function calculateSampleStats(values: number[]): {
  mean: number;
  stdDev: number;
  stdError: number;
  count: number;
} {
  const count = values.length;
  if (count === 0) return { mean: 0, stdDev: 0, stdError: 0, count: 0 };
  if (count === 1) return { mean: values[0], stdDev: 0, stdError: 0, count: 1 };

  const mean = values.reduce((acc, v) => acc + v, 0) / count;
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (count - 1);
  const stdDev = Math.sqrt(variance);
  const stdError = stdDev / Math.sqrt(count);

  return { mean, stdDev, stdError, count };
}

/**
 * Calculates percentage error against reference value
 */
export function calculatePercentError(experimental: number, accepted: number): number {
  if (accepted === 0) return 0;
  return Math.abs((experimental - accepted) / accepted) * 100;
}

/**
 * Formats scientific numbers cleanly for physics display
 */
export function formatScientific(num: number, sigFigs = 4): string {
  if (num === 0) return '0';
  if (Math.abs(num) >= 0.01 && Math.abs(num) < 10000) {
    return Number(num.toPrecision(sigFigs)).toString();
  }
  const expStr = num.toExponential(sigFigs - 1);
  const [mantissa, exponent] = expStr.split('e');
  return `${mantissa} × 10^${parseInt(exponent, 10)}`;
}
