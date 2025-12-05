import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { useState } from 'react';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="font-semibold text-gray-800 mb-2">
                    Saat: {String(label).padStart(2, '0')}:00
                </p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-semibold" style={{ color: entry.color }}>
                            {entry.value !== null ? `${entry.value}%` : 'N/A'}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// Density Chart Component
export const DensityChart = ({ hourlyData }) => {
    const [viewMode, setViewMode] = useState('full'); // 'full', 'weekday', 'weekend'

    // Check if we have weekday/weekend data
    const hasWeekdayData = hourlyData && hourlyData[0] && hourlyData[0].live_weekday !== undefined;

    // Transform data for Recharts based on view mode
    const chartData = hourlyData.map(d => {
        let liveValue, normalValue;

        if (viewMode === 'weekday') {
            liveValue = d.live_weekday;
            normalValue = d.non_live_weekday;
        } else if (viewMode === 'weekend') {
            liveValue = d.live_weekend;
            normalValue = d.non_live_weekend;
        } else {
            liveValue = d.live_density;
            normalValue = d.non_live_density;
        }

        return {
            hour: d.hour ?? d.data_hour_slot,
            'Canlı Yoğunluk': liveValue,
            'Normal Yoğunluk': normalValue,
        };
    });

    const viewModeLabels = {
        'full': 'Full',
        'weekday': 'Hafta İçi',
        'weekend': 'Hafta Sonu'
    };

    return (
        <div className="w-full">
            {/* Chart Title & Controls */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Saatlik Yoğunluk Analizi</h3>
                    <p className="text-sm text-gray-500">
                        {viewMode === 'weekday' ? 'Pazartesi - Perşembe ortalaması' :
                            viewMode === 'weekend' ? 'Cuma - Cumartesi - Pazar ortalaması' :
                                'Tüm günler ortalaması'}
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* View Mode Buttons */}
                    {hasWeekdayData && (
                        <div className="flex rounded-lg overflow-hidden border border-gray-200">
                            {['full', 'weekday', 'weekend'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === mode
                                        ? mode === 'weekend'
                                            ? 'bg-orange-500 text-white'
                                            : mode === 'weekday'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-700 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {viewModeLabels[mode]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chart Container */}
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        <XAxis
                            dataKey="hour"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            tickLine={{ stroke: '#d1d5db' }}
                            axisLine={{ stroke: '#d1d5db' }}
                            tickFormatter={(value) => `${String(value).padStart(2, '0')}:00`}
                            interval={2}
                        />

                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            tickLine={{ stroke: '#d1d5db' }}
                            axisLine={{ stroke: '#d1d5db' }}
                            tickFormatter={(value) => `${value}%`}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                        />

                        {/* Reference line at 50% */}
                        <ReferenceLine
                            y={50}
                            stroke="#9ca3af"
                            strokeDasharray="5 5"
                            label={{ value: 'Orta', position: 'right', fill: '#9ca3af', fontSize: 11 }}
                        />

                        {/* Normal Density Line - Gray, Dashed */}
                        <Line
                            type="monotone"
                            dataKey="Normal Yoğunluk"
                            stroke="#9ca3af"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: '#9ca3af', r: 3 }}
                            activeDot={{ r: 5, fill: '#6b7280' }}
                            connectNulls={true}
                        />

                        {/* Live Density Line - Blue, Solid */}
                        <Line
                            type="monotone"
                            dataKey="Canlı Yoğunluk"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Legend Explanation */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-gray-400" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #9ca3af, #9ca3af 5px, transparent 5px, transparent 10px)' }}></div>
                    <span>Normal: {viewMode === 'weekday' ? 'Hafta içi' : viewMode === 'weekend' ? 'Hafta sonu' : 'Genel'} ortalama</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-blue-500 rounded"></div>
                    <span>Canlı: {viewMode === 'weekday' ? 'Hafta içi' : viewMode === 'weekend' ? 'Hafta sonu' : 'Genel'} canlı ort.</span>
                </div>
            </div>
        </div>
    );
};

export default DensityChart;
