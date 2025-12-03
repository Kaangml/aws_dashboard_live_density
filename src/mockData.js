// Mock Data Generator for Venue Density Dashboard
// Mimics the structure of the CSV data with additional metadata

const VENUE_NAMES = [
    "Kaşe Tekel-Şarküteri",
    "Sunal Tekel",
    "SOYSALLAR TEKEL",
    "Murat Çiftliği Şarküteri",
    "Acıbadem Kuruyemis & Tekel",
    "TEKELİKA TEKEL ŞARKÜTERİ",
    "Yeşil Alan Market & Meze Evi",
    "Gülen Tekel 3",
    "Koruçam Restaurant & Ocakbaşı",
    "DİLKAN TEKEL",
    "Gülen Tekel & Kuruyemiş",
    "İlk Vapur",
    "The Tekel Fenerbahçe",
    "İddalı Tekel Erenköy",
    "DRAFT",
    "Ateş Tekel Shop",
    "Bade Tekel Feneryolu",
    "Egeden Yöresel Tekel Şarküteri",
    "Dorock XL by Holly Stone",
    "Akasya Tekel Ümraniye"
];

const SEGMENTS = ['A', 'B', 'C'];

// Helper function to generate random number within range
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate random float within range
const randomFloat = (min, max, decimals = 1) => {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
};

// Generate hourly density pattern (realistic pattern - higher in evening hours)
const generateDensityPattern = (hour) => {
    // Base pattern: low at night, peak in evening
    const patterns = {
        0: 15, 1: 10, 2: 5, 3: 3, 4: 2, 5: 3,
        6: 5, 7: 8, 8: 12, 9: 18, 10: 25, 11: 35,
        12: 45, 13: 50, 14: 45, 15: 40, 16: 45, 17: 55,
        18: 65, 19: 75, 20: 85, 21: 80, 22: 70, 23: 45
    };
    // Add some randomness
    const base = patterns[hour] || 30;
    return Math.min(100, Math.max(0, base + randomInRange(-15, 15)));
};

// Generate mock data for all venues
export const generateMockData = () => {
    const venues = [];

    VENUE_NAMES.forEach((name, index) => {
        // Generate venue metadata
        const segment = SEGMENTS[index % 3];
        const score = randomFloat(5.0, 9.9, 1);
        const volumeForecast = randomInRange(500, 3000);

        // Generate hourly data for this venue
        const hourlyData = [];

        for (let hour = 0; hour < 24; hour++) {
            const non_live_density = generateDensityPattern(hour);

            // live_density can be null (simulate real-world data gaps)
            // About 30% chance of being null
            const hasLiveData = Math.random() > 0.3;
            const live_density = hasLiveData
                ? Math.min(100, Math.max(0, non_live_density + randomInRange(-25, 40)))
                : null;

            hourlyData.push({
                data_hour_slot: hour,
                live_density,
                non_live_density
            });
        }

        // Calculate the latest available live density for opportunity detection
        const latestLiveData = [...hourlyData]
            .reverse()
            .find(d => d.live_density !== null);

        const latestNonLiveData = hourlyData[hourlyData.length - 1];

        // Check if high opportunity (live > non_live by more than 20%)
        let isHighOpportunity = false;
        if (latestLiveData && latestNonLiveData) {
            const diff = latestLiveData.live_density - latestNonLiveData.non_live_density;
            const percentDiff = (diff / latestNonLiveData.non_live_density) * 100;
            isHighOpportunity = percentDiff > 20;
        }

        venues.push({
            id: index + 1,
            name,
            segment,
            score,
            volumeForecast,
            hourlyData,
            latestLiveDensity: latestLiveData?.live_density ?? null,
            latestNonLiveDensity: latestNonLiveData?.non_live_density ?? null,
            isHighOpportunity
        });
    });

    return venues;
};

// Get venue by ID
export const getVenueById = (venues, id) => {
    return venues.find(v => v.id === id);
};

// Filter venues by search term
export const filterVenues = (venues, searchTerm) => {
    if (!searchTerm.trim()) return venues;
    const term = searchTerm.toLowerCase();
    return venues.filter(v => v.name.toLowerCase().includes(term));
};

export default generateMockData;
