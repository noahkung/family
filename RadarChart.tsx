// client/src/components/RadarChart.tsx

import { useEffect, useRef } from 'react';
import { Chart, RadialLinearScale, LineElement, PointElement, Tooltip, Legend, Filler, RadarController } from 'chart.js';
import { AssessmentResults } from '@shared/schema';
import { useLanguage } from '@/hooks/useLanguage';

Chart.register(RadialLinearScale, LineElement, PointElement, Tooltip, Legend, Filler, RadarController);

interface RadarChartProps {
  results: AssessmentResults;
  className?: string;
  dimensionsData: { key: string; name: string; result: any }[]; 
}

export function RadarChart({ results, className = "", dimensionsData }: RadarChartProps) { 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // กำหนด labels จาก dimensionsData.name ที่ถูกแปลแล้ว
    // ตรวจสอบลำดับให้ถูกต้องตามที่คุณต้องการให้แกนกราฟแสดง
    // ใช้ Optional Chaining (?) และ Fallback (||) เพื่อป้องกัน Error กรณีข้อมูลไม่สมบูรณ์
    const labels = [
      dimensionsData[0]?.name || t('dimension.governance'), // Governance (North)
      dimensionsData[2]?.name || t('dimension.relationships'), // Relationships (East)
      dimensionsData[3]?.name || t('Strategy'), // Strategy (South)
      dimensionsData[1]?.name || t('dimension.legacy'), // Legacy (West)
    ];

    // กำหนด data ให้ตรงตามลำดับของ labels
    // ใช้ Optional Chaining (?) และ Fallback (|| 0) เพื่อป้องกัน Error กรณีข้อมูลไม่สมบูรณ์
    const data = [
      results.governance?.percentage || 0,
      results.relationships?.percentage || 0,
      (results as any).strategy?.percentage || 0, 
      results.legacy?.percentage || 0,
    ];

    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: language === 'en' ? 'Your Score' : 'คะแนนของคุณ',
          data,
          backgroundColor: 'rgba(30, 64, 175, 0.2)',
          borderColor: '#1E40AF',
          borderWidth: 3,
          pointBackgroundColor: '#F59E0B',
          pointBorderColor: '#1E40AF',
          pointBorderWidth: 2,
          pointRadius: 6,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${Math.round(context.parsed.r)}%` // ปัดเปอร์เซ็นต์ใน tooltip
            }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              font: {
                size: 12
              }
            },
            pointLabels: {
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#1F2937'
            },
            grid: {
              color: '#E5E7EB'
            },
            angleLines: {
              color: '#E5E7EB'
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [results, language, t, dimensionsData]); 

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}