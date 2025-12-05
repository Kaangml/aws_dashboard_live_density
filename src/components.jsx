import { MapPin, TrendingUp, Droplets, Star, X, Users, Calendar, ArrowUpRight, ArrowDownRight, Target, Award, Zap, Building2, Wine, Store, ShoppingBag, Navigation, Waves, Trees, Landmark, ParkingCircle, Music2, ShoppingCart, Minus } from 'lucide-react';

// Venue Card Component
export const VenueCard = ({ venue, onClick }) => {
    const {
        name, segment, segmentNew, score, volumeForecast, channel,
        latestLiveDensity, latestNonLiveDensity, isHighOpportunity,
        kuver, kuverNew, dailyVisitorsNormal, dailyVisitorsLive,
        monthlyVisitorsNormal, monthlyVisitorsLive,
        visitorDiff, visitorDiffPercent,
        profilSkor, popSkor, profileScore, populationScore,
        monthlyAlcoholNormal, monthlyAlcoholLive, alcoholDiff
    } = venue;

    // Segment color mapping - yeni segmentler için de
    const getSegmentStyle = (seg) => {
        if (!seg) return 'bg-gray-100 text-gray-800';
        // Yeni format: 1-A, 2-B, 3-C, 4-D gibi
        if (seg.startsWith('4-')) return 'bg-green-100 text-green-800';
        if (seg.startsWith('3-')) return 'bg-blue-100 text-blue-800';
        if (seg.startsWith('2-')) return 'bg-yellow-100 text-yellow-800';
        if (seg.startsWith('1-')) return 'bg-red-100 text-red-800';
        // Eski format
        if (seg.includes('D1')) return 'bg-red-100 text-red-800';
        if (seg.includes('D2')) return 'bg-orange-100 text-orange-800';
        if (seg.includes('D3')) return 'bg-yellow-100 text-yellow-800';
        if (seg.includes('D4')) return 'bg-green-100 text-green-800';
        if (seg === 'A') return 'bg-green-100 text-green-800';
        if (seg === 'B') return 'bg-blue-100 text-blue-800';
        return 'bg-purple-100 text-purple-800';
    };

    // Visitor fark durumu
    const hasVisitorData = (kuver || kuverNew) && dailyVisitorsNormal !== undefined;
    const diffIsPositive = visitorDiff > 0;
    const displayKuver = kuverNew || kuver;
    const displaySegment = segmentNew || segment;
    const isAcikKanal = channel === 'Açık Kanal';

    // Display scores
    const displayProfilSkor = profilSkor || (profileScore ? Math.round(profileScore) : null);
    const displayPopSkor = popSkor || (populationScore ? Math.round(populationScore) : null);

    return (
        <div
            onClick={() => onClick(venue)}
            className={`
        bg-white rounded-xl p-5 cursor-pointer
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        border-2 ${isHighOpportunity
                    ? 'border-red-400 shadow-red-100 shadow-lg'
                    : isAcikKanal
                        ? 'border-emerald-100 hover:border-emerald-300'
                        : 'border-purple-100 hover:border-purple-300'}
      `}
        >
            {/* Channel & Opportunity Badge */}
            <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isAcikKanal ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                    {isAcikKanal ? <Store size={12} /> : <ShoppingBag size={12} />}
                    <span>{isAcikKanal ? 'Açık' : 'Kapalı'}</span>
                </div>
                {isHighOpportunity && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
                        <TrendingUp size={14} />
                        <span>Yüksek Fırsat</span>
                    </div>
                )}
            </div>

            {/* Venue Name */}
            <div className="flex items-start gap-2 mb-3">
                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
                    {name}
                </h3>
            </div>

            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                {/* Segment Badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSegmentStyle(displaySegment)}`}>
                    {displaySegment}
                </span>

                {/* Score Badge veya Profil/Pop Skor */}
                {displayProfilSkor ? (
                    <>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800" title="Profil Skoru">
                            <Award size={12} />
                            {displayProfilSkor}
                        </span>
                        {displayPopSkor && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800" title="Popülerlik Skoru">
                                <Zap size={12} />
                                {displayPopSkor}
                            </span>
                        )}
                    </>
                ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        <Star size={12} fill="currentColor" />
                        {score}
                    </span>
                )}

                {/* Kuver Badge */}
                {displayKuver && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        <Users size={12} />
                        {displayKuver}
                    </span>
                )}
            </div>

            {/* Visitor Stats - Primary Display (AYLIK) */}
            {hasVisitorData ? (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-emerald-600" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Aylık Ziyaretçi</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-xl font-bold text-emerald-700">{monthlyVisitorsLive?.toLocaleString()}</p>
                                    <span className="text-xs text-gray-500">/ {monthlyVisitorsNormal?.toLocaleString()} normal</span>
                                </div>
                            </div>
                        </div>
                        {visitorDiff !== undefined && visitorDiff !== 0 && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${diffIsPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {diffIsPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {diffIsPositive ? '+' : ''}{visitorDiffPercent}%
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Volume Forecast - Fallback Display */
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2">
                        <Droplets size={20} className="text-blue-500" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Hacim Tahmini</p>
                            <p className="text-xl font-bold text-blue-700">{volumeForecast.toLocaleString()} Lt</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Alcohol Stats (if available) */}
            {monthlyAlcoholLive && (
                <div className="flex items-center gap-2 mb-3 text-xs bg-purple-50 rounded-lg px-3 py-2">
                    <Wine size={14} className="text-purple-600" />
                    <span className="text-purple-700">
                        Aylık: <strong>{monthlyAlcoholLive} Lt</strong>
                        {alcoholDiff !== 0 && (
                            <span className={alcoholDiff > 0 ? 'text-green-600' : 'text-red-600'}>
                                {' '}({alcoholDiff > 0 ? '+' : ''}{alcoholDiff} Lt)
                            </span>
                        )}
                    </span>
                </div>
            )}

            {/* Daily Visitors Summary */}
            {hasVisitorData && (
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <Users size={14} />
                    <span><strong className="text-gray-800">{dailyVisitorsLive}</strong> / {dailyVisitorsNormal} normal</span>
                </div>
            )}

            {/* Density Comparison */}
            <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Normal</p>
                    <p className="text-lg font-bold text-gray-700">
                        {latestNonLiveDensity !== null && latestNonLiveDensity !== undefined
                            ? `${latestNonLiveDensity}%`
                            : <span className="text-gray-400 text-sm">Veri Yok</span>}
                    </p>
                </div>
                <div className={`rounded-lg p-2 ${latestLiveDensity !== null && latestLiveDensity !== undefined ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <p className="text-xs text-gray-500">Anlık</p>
                    <p className={`text-lg font-bold ${latestLiveDensity !== null && latestLiveDensity !== undefined ? 'text-blue-600' : 'text-gray-400'}`}>
                        {latestLiveDensity !== null && latestLiveDensity !== undefined
                            ? `${latestLiveDensity}%`
                            : <span className="text-sm">Veri Yok</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Modal Component for Detail View
export const VenueModal = ({ venue, onClose, children }) => {
    if (!venue) return null;

    const hasVisitorData = (venue.kuver || venue.kuverNew) && venue.dailyVisitorsNormal !== undefined;
    const hasAlcoholData = venue.monthlyAlcoholNormal !== undefined;
    const hasScoreData = venue.profilSkor !== undefined;
    const hasRakipData = venue.rakipToplam100m !== undefined;
    const hasOkazyonData = venue.okazyonBilgileri !== undefined;
    const hasYakinlikData = venue.rakipBilgileri !== undefined;
    const isKapaliKanal = venue.channel === 'Kapalı Kanal';
    const displaySegment = venue.segmentNew || venue.segment;
    const displayKuver = venue.kuverNew || venue.kuver;

    // Segment color
    const getSegmentStyle = (seg) => {
        if (!seg) return 'bg-gray-100 text-gray-800';
        if (seg.includes('D1')) return 'bg-red-100 text-red-800';
        if (seg.includes('D2')) return 'bg-orange-100 text-orange-800';
        if (seg.includes('D3')) return 'bg-yellow-100 text-yellow-800';
        if (seg.includes('D4')) return 'bg-green-100 text-green-800';
        if (seg === 'A') return 'bg-green-100 text-green-800';
        if (seg === 'B') return 'bg-blue-100 text-blue-800';
        return 'bg-purple-100 text-purple-800';
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{venue.name}</h2>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSegmentStyle(displaySegment)}`}>
                                {displaySegment}
                            </span>
                            {hasScoreData ? (
                                <>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800" title="Profil Skoru">
                                        <Award size={12} />
                                        Profil: {venue.profilSkor}
                                    </span>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800" title="Popülerlik">
                                        <Zap size={12} />
                                        Pop: {venue.popSkor}
                                    </span>
                                </>
                            ) : (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                    <Star size={12} fill="currentColor" />
                                    {venue.score}
                                </span>
                            )}
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                <Droplets size={12} />
                                {venue.volumeForecast.toLocaleString()} Lt
                            </span>
                            {displayKuver && (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                    <Users size={12} />
                                    Kuver: {displayKuver}
                                </span>
                            )}
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
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">

                    {/* Score Details Section */}
                    {hasScoreData && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Target size={20} className="text-purple-600" />
                                Skor Detayları
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-amber-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-amber-600 mb-1">Profil Skoru</p>
                                    <p className="text-2xl font-bold text-amber-700">{venue.profilSkor}</p>
                                    <p className="text-xs text-amber-500">Müşteri Kalitesi</p>
                                </div>
                                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-indigo-600 mb-1">Pop Skoru</p>
                                    <p className="text-2xl font-bold text-indigo-700">{venue.popSkor}</p>
                                    <p className="text-xs text-indigo-500">Yoğunluk</p>
                                </div>
                                {venue.densitySkor && (
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <p className="text-xs text-gray-600 mb-1">Density Score</p>
                                        <p className="text-2xl font-bold text-gray-700">{venue.densitySkor}</p>
                                        <p className="text-xs text-gray-500">Google</p>
                                    </div>
                                )}
                                {venue.instaSkor && (
                                    <div className="bg-pink-50 rounded-xl p-4 text-center">
                                        <p className="text-xs text-pink-600 mb-1">Insta Score</p>
                                        <p className="text-2xl font-bold text-pink-700">{venue.instaSkor}</p>
                                        <p className="text-xs text-pink-500">Sosyal Medya</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Alcohol Forecast Section */}
                    {hasAlcoholData && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Wine size={20} className="text-purple-600" />
                                Alkol Tüketim Tahmini
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-purple-600 mb-1">Yıllık Tahmin</p>
                                    <p className="text-2xl font-bold text-purple-700">
                                        {venue.yearlyAlcoholForecast ? venue.yearlyAlcoholForecast.toLocaleString() : <span className="text-gray-400 text-lg">-</span>}
                                    </p>
                                    <p className="text-xs text-purple-500">Litre</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Aylık (Normal)</p>
                                    <p className="text-2xl font-bold text-gray-700">
                                        {venue.monthlyAlcoholNormal ? venue.monthlyAlcoholNormal.toLocaleString() : <span className="text-gray-400 text-lg">-</span>}
                                    </p>
                                    <p className="text-xs text-gray-500">Litre</p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-blue-600 mb-1">Aylık (Canlı)</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {venue.monthlyAlcoholLive ? venue.monthlyAlcoholLive.toLocaleString() : <span className="text-gray-400 text-lg">-</span>}
                                    </p>
                                    <p className="text-xs text-blue-500">Litre</p>
                                </div>
                                {venue.alcoholDiff !== 0 && venue.alcoholDiff !== null && venue.alcoholDiff !== undefined ? (
                                    <div className={`rounded-xl p-4 text-center ${venue.alcoholDiff > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                        <p className={`text-xs mb-1 ${venue.alcoholDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>Fark</p>
                                        <div className="flex items-center justify-center gap-1">
                                            {venue.alcoholDiff > 0 ?
                                                <ArrowUpRight size={20} className="text-green-600" /> :
                                                <ArrowDownRight size={20} className="text-red-600" />
                                            }
                                            <p className={`text-2xl font-bold ${venue.alcoholDiff > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                {venue.alcoholDiff > 0 ? '+' : ''}{venue.alcoholDiff}
                                            </p>
                                        </div>
                                        <p className={`text-xs ${venue.alcoholDiff > 0 ? 'text-green-500' : 'text-red-500'}`}>Litre/Ay</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <p className="text-xs text-gray-500 mb-1">Fark</p>
                                        <div className="flex items-center justify-center gap-1">
                                            <Minus size={20} className="text-gray-400" />
                                            <p className="text-2xl font-bold text-gray-400">0</p>
                                        </div>
                                        <p className="text-xs text-gray-400">Değişim yok</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Rakip Analizi Section */}
                    {hasRakipData && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-orange-600" />
                                Çevre Analizi (Rakipler)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-orange-50 rounded-xl p-4">
                                    <p className="text-xs text-orange-600 mb-2 font-semibold">100m Yarıçapı</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Açık Kanal:</span>
                                            <span className="font-bold text-orange-700">{venue.rakipAcik100m}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Kapalı Kanal:</span>
                                            <span className="font-bold text-gray-700">{venue.rakipKapali100m}</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t pt-1 mt-1">
                                            <span className="text-gray-700 font-medium">Toplam:</span>
                                            <span className="font-bold text-orange-800">{venue.rakipToplam100m}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-red-50 rounded-xl p-4">
                                    <p className="text-xs text-red-600 mb-2 font-semibold">200m Yarıçapı</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Açık Kanal:</span>
                                            <span className="font-bold text-red-700">{venue.rakipAcik200m}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Kapalı Kanal:</span>
                                            <span className="font-bold text-gray-700">{venue.rakipKapali200m}</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t pt-1 mt-1">
                                            <span className="text-gray-700 font-medium">Toplam:</span>
                                            <span className="font-bold text-red-800">{venue.rakipToplam200m}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-4 flex flex-col items-center justify-center">
                                    <p className="text-xs text-gray-600 mb-1">Toplam Rakip</p>
                                    <p className="text-3xl font-bold text-gray-800">{venue.rakipToplam200m}</p>
                                    <p className="text-xs text-gray-500">200m içinde</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Okazyon Bilgileri Section - Kapalı Kanal */}
                    {isKapaliKanal && hasOkazyonData && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Store size={20} className="text-purple-600" />
                                Okazyon Bilgileri
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {venue.okazyonBilgileri.caddeUstu === 1 && (
                                    <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-2">
                                        <Navigation size={16} className="text-purple-600" />
                                        <p className="text-xs text-purple-700 font-semibold">Cadde Üstü</p>
                                    </div>
                                )}
                                {venue.okazyonBilgileri.kose === 1 && (
                                    <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-2">
                                        <MapPin size={16} className="text-purple-600" />
                                        <p className="text-xs text-purple-700 font-semibold">Köşe</p>
                                    </div>
                                )}
                                {venue.okazyonBilgileri.sahil === 1 && (
                                    <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
                                        <Waves size={16} className="text-blue-600" />
                                        <p className="text-xs text-blue-700 font-semibold">Sahil</p>
                                    </div>
                                )}
                                {venue.okazyonBilgileri.barlarSokagi === 1 && (
                                    <div className="bg-red-50 rounded-lg p-3 flex items-center gap-2">
                                        <Wine size={16} className="text-red-600" />
                                        <p className="text-xs text-red-700 font-semibold">Barlar Sokağı</p>
                                    </div>
                                )}
                                {venue.okazyonBilgileri.park === 1 && (
                                    <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2">
                                        <Trees size={16} className="text-green-600" />
                                        <p className="text-xs text-green-700 font-semibold">Park</p>
                                    </div>
                                )}
                                {venue.okazyonBilgileri.stadyum === 1 && (
                                    <div className="bg-orange-50 rounded-lg p-3 flex items-center gap-2">
                                        <Landmark size={16} className="text-orange-600" />
                                        <p className="text-xs text-orange-700 font-semibold">Stadyum</p>
                                    </div>
                                )}
                                {venue.okazyonBilgileri.zincirMarket === 1 && (
                                    <div className="bg-amber-50 rounded-lg p-3 flex items-center gap-2">
                                        <ShoppingCart size={16} className="text-amber-600" />
                                        <p className="text-xs text-amber-700 font-semibold">Zincir Market</p>
                                    </div>
                                )}
                                {venue.okazyonBilgileri.otopark === 1 && (
                                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                                        <ParkingCircle size={16} className="text-gray-600" />
                                        <p className="text-xs text-gray-700 font-semibold">Otopark</p>
                                    </div>
                                )}
                                {venue.okazyonBilgileri.konserAlani === 1 && (
                                    <div className="bg-pink-50 rounded-lg p-3 flex items-center gap-2">
                                        <Music2 size={16} className="text-pink-600" />
                                        <p className="text-xs text-pink-700 font-semibold">Konser Alanı</p>
                                    </div>
                                )}
                            </div>

                            {/* Dolap Bilgileri */}
                            {venue.okazyonBilgileri.tahminiDolapSayisi > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-500">Toplam Dolap</p>
                                        <p className="text-xl font-bold text-gray-700">{venue.okazyonBilgileri.tahminiDolapSayisi}</p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-yellow-600">Tuborg</p>
                                        <p className="text-xl font-bold text-yellow-700">{venue.okazyonBilgileri.tahminiTuborg || 0}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-green-600">Efes</p>
                                        <p className="text-xl font-bold text-green-700">{venue.okazyonBilgileri.tahminiEfes || 0}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Yakınlık Bilgileri Section - Kapalı Kanal */}
                    {isKapaliKanal && hasYakinlikData && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-orange-600" />
                                Çevre Analizi (Yakınlık)
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-green-50 rounded-xl p-4">
                                    <p className="text-xs text-green-600 mb-2 font-semibold">60m Yarıçapı</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Açık:</span>
                                            <span className="font-bold text-green-700">{venue.rakipBilgileri.yakinlikAcik60m || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Kapalı:</span>
                                            <span className="font-bold text-gray-700">{venue.rakipBilgileri.yakinlikKapali60m || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 rounded-xl p-4">
                                    <p className="text-xs text-yellow-600 mb-2 font-semibold">110m Yarıçapı</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Açık:</span>
                                            <span className="font-bold text-yellow-700">{venue.rakipBilgileri.yakinlikAcik110m || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Kapalı:</span>
                                            <span className="font-bold text-gray-700">{venue.rakipBilgileri.yakinlikKapali110m || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-red-50 rounded-xl p-4">
                                    <p className="text-xs text-red-600 mb-2 font-semibold">210m Yarıçapı</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Açık:</span>
                                            <span className="font-bold text-red-700">{venue.rakipBilgileri.yakinlikAcik210m || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Kapalı:</span>
                                            <span className="font-bold text-gray-700">{venue.rakipBilgileri.yakinlikKapali210m || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visitor Stats Section */}
                    {hasVisitorData && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Users size={20} className="text-emerald-600" />
                                Ziyaretçi İstatistikleri
                            </h3>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {/* Günlük Normal */}
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Günlük (Normal)</p>
                                    <p className="text-2xl font-bold text-gray-700">{venue.dailyVisitorsNormal}</p>
                                    <p className="text-xs text-gray-400">ziyaretçi</p>
                                </div>

                                {/* Günlük Canlı */}
                                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-emerald-600 mb-1">Günlük (Canlı)</p>
                                    <p className="text-2xl font-bold text-emerald-700">{venue.dailyVisitorsLive}</p>
                                    <p className="text-xs text-emerald-500">ziyaretçi</p>
                                </div>

                                {/* Aylık Normal */}
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Aylık (Normal)</p>
                                    <p className="text-2xl font-bold text-gray-700">{venue.monthlyVisitorsNormal?.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">ziyaretçi</p>
                                </div>

                                {/* Aylık Canlı */}
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                    <p className="text-xs text-blue-600 mb-1">Aylık (Canlı)</p>
                                    <p className="text-2xl font-bold text-blue-700">{venue.monthlyVisitorsLive?.toLocaleString()}</p>
                                    <p className="text-xs text-blue-500">ziyaretçi</p>
                                </div>
                            </div>

                            {/* Comparison Row */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Son 3 Ay Günlük */}
                                {venue.dailyVisitors3mNormal !== undefined && (
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <p className="text-xs text-purple-600 mb-1">Son 3 Ay Ortalaması</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-xl font-bold text-purple-700">{venue.dailyVisitors3mLive}</p>
                                            <span className="text-xs text-gray-500">/ {venue.dailyVisitors3mNormal} normal</span>
                                        </div>
                                        <p className="text-xs text-purple-500">günlük ziyaretçi</p>
                                    </div>
                                )}

                                {/* Yıllık Tahmin */}
                                {venue.yearlyVisitorsNormal !== undefined && (
                                    <div className="bg-amber-50 rounded-xl p-4">
                                        <p className="text-xs text-amber-600 mb-1">Yıllık Tahmin</p>
                                        <p className="text-xl font-bold text-amber-700">{venue.yearlyVisitorsLive?.toLocaleString()}</p>
                                        <p className="text-xs text-amber-500">ziyaretçi</p>
                                    </div>
                                )}

                                {/* Fark Analizi */}
                                {venue.visitorDiff !== undefined && (
                                    <div className={`rounded-xl p-4 ${venue.visitorDiff > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                        <p className={`text-xs mb-1 ${venue.visitorDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            Canlı vs Normal Fark
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {venue.visitorDiff > 0 ?
                                                <ArrowUpRight size={20} className="text-green-600" /> :
                                                <ArrowDownRight size={20} className="text-red-600" />
                                            }
                                            <p className={`text-xl font-bold ${venue.visitorDiff > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                {venue.visitorDiff > 0 ? '+' : ''}{venue.visitorDiff}
                                            </p>
                                            <span className={`text-sm font-semibold ${venue.visitorDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ({venue.visitorDiff > 0 ? '+' : ''}{venue.visitorDiffPercent}%)
                                            </span>
                                        </div>
                                        <p className={`text-xs ${venue.visitorDiff > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            günlük fark
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Chart Section */}
                    <div className="border-t pt-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};// Search Bar Component
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
