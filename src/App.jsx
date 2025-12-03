import { useState, useMemo, useEffect } from 'react';
import { BarChart3, RefreshCw, Database, Loader2 } from 'lucide-react';
import { VenueCard, VenueModal, SearchBar } from './components';
import { DensityChart } from './DensityChart';

// Veri yükleme fonksiyonu
const loadDashboardData = async () => {
  try {
    const response = await fetch('/dashboard_data.json');
    if (!response.ok) throw new Error('Veri yüklenemedi');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Veri yükleme hatası:', error);
    return [];
  }
};

// Veri filtreleme fonksiyonu
const filterVenues = (venues, searchTerm) => {
  if (!searchTerm.trim()) return venues;
  const term = searchTerm.toLowerCase();
  return venues.filter(v => v.name.toLowerCase().includes(term));
};

function App() {
  // State management
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Veriyi yükle
  useEffect(() => {
    loadDashboardData().then(data => {
      setVenues(data);
      setLoading(false);
    });
  }, []);

  // Filtered venues based on search
  const filteredVenues = useMemo(() => {
    return filterVenues(venues, searchTerm);
  }, [venues, searchTerm]);

  // Reload data
  const handleRefresh = async () => {
    setLoading(true);
    const data = await loadDashboardData();
    setVenues(data);
    setSelectedVenue(null);
    setLoading(false);
  };

  // Stats for header
  const stats = useMemo(() => {
    if (venues.length === 0) return { highOpportunityCount: 0, avgScore: 0, totalVolume: 0 };
    const highOpportunityCount = venues.filter(v => v.isHighOpportunity).length;
    const avgScore = (venues.reduce((sum, v) => sum + v.score, 0) / venues.length).toFixed(1);
    const totalVolume = venues.reduce((sum, v) => sum + v.volumeForecast, 0);
    return { highOpportunityCount, avgScore, totalVolume };
  }, [venues]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <BarChart3 size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Mekan Yoğunluk Dashboard</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">Anlık ve geçmiş yoğunluk analizi</p>
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <Database size={10} />
                    Gerçek Veri
                  </span>
                </div>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <button
                onClick={handleRefresh}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                title="Verileri Yenile"
              >
                <RefreshCw size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Toplam Mekan:</span>
              <span className="font-semibold text-gray-800">{venues.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Yüksek Fırsat:</span>
              <span className="font-semibold text-red-600">{stats.highOpportunityCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Ort. Skor:</span>
              <span className="font-semibold text-amber-600">{stats.avgScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Toplam Hacim:</span>
              <span className="font-semibold text-blue-600">{stats.totalVolume.toLocaleString()} Lt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Venue Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredVenues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aramanızla eşleşen mekan bulunamadı.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Aramayı Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVenues.map(venue => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onClick={setSelectedVenue}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal for Detail View */}
      <VenueModal venue={selectedVenue} onClose={() => setSelectedVenue(null)}>
        {selectedVenue && (
          <DensityChart hourlyData={selectedVenue.hourlyData} />
        )}
      </VenueModal>
    </div>
  );
}

export default App;
