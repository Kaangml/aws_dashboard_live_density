import { MapPin, TrendingUp, Droplets, Star, X } from 'lucide-react';

// Venue Card Component
export const VenueCard = ({ venue, onClick }) => {
    const { name, segment, score, volumeForecast, latestLiveDensity, latestNonLiveDensity, isHighOpportunity } = venue;

    // Segment color mapping
    const segmentColors = {
        'A': 'bg-green-100 text-green-800',
        'B': 'bg-blue-100 text-blue-800',
        'C': 'bg-purple-100 text-purple-800'
    };

    return (
        <div
            onClick={() => onClick(venue)}
            className={`
        bg-white rounded-xl p-5 cursor-pointer
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        border-2 ${isHighOpportunity
                    ? 'border-red-400 shadow-red-100 shadow-lg'
                    : 'border-gray-100 hover:border-blue-200'}
      `}
        >
            {/* High Opportunity Badge */}
            {isHighOpportunity && (
                <div className="flex items-center gap-1 text-xs font-semibold text-red-600 mb-2">
                    <TrendingUp size={14} />
                    <span>Yüksek Fırsat</span>
                </div>
            )}

            {/* Venue Name */}
            <div className="flex items-start gap-2 mb-3">
                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
                    {name}
                </h3>
            </div>

            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-4">
                {/* Segment Badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${segmentColors[segment]}`}>
                    Seg {segment}
                </span>

                {/* Score Badge */}
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    <Star size={12} fill="currentColor" />
                    {score}
                </span>
            </div>

            {/* Volume Forecast - Prominent Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                    <Droplets size={20} className="text-blue-500" />
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Hacim Tahmini</p>
                        <p className="text-xl font-bold text-blue-700">{volumeForecast.toLocaleString()} Lt</p>
                    </div>
                </div>
            </div>

            {/* Density Comparison */}
            <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Normal</p>
                    <p className="text-lg font-bold text-gray-700">
                        {latestNonLiveDensity ?? '-'}%
                    </p>
                </div>
                <div className={`rounded-lg p-2 ${latestLiveDensity !== null ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <p className="text-xs text-gray-500">Anlık</p>
                    <p className={`text-lg font-bold ${latestLiveDensity !== null ? 'text-blue-600' : 'text-gray-400'}`}>
                        {latestLiveDensity !== null ? `${latestLiveDensity}%` : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Modal Component for Detail View
export const VenueModal = ({ venue, onClose, children }) => {
    if (!venue) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{venue.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${venue.segment === 'A' ? 'bg-green-100 text-green-800' :
                                    venue.segment === 'B' ? 'bg-blue-100 text-blue-800' :
                                        'bg-purple-100 text-purple-800'
                                }`}>
                                Segment {venue.segment}
                            </span>
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                <Star size={12} fill="currentColor" />
                                {venue.score}
                            </span>
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                <Droplets size={12} />
                                {venue.volumeForecast.toLocaleString()} Lt
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Search Bar Component
export const SearchBar = ({ value, onChange }) => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Mekan ara..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full md:w-80 px-4 py-3 pl-12 rounded-xl border border-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   text-gray-700 placeholder-gray-400 bg-white shadow-sm"
            />
            <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
        </div>
    );
};
