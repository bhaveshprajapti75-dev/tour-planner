import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePlannerStore = create(
    persist(
        (set) => ({
            // Step 1: Trip Details
            duration: 0,
            category: null, // solo, couple, family
            passengers: {
                adults: 2,
                children: 0,
                rooms: 1,
            },

            // Step 2 & 3: Destinations & Itinerary
            selectedCities: [], // array of city IDs
            itinerary: {}, // { dateString: { cityId, accommodations: [], activities: { morning: [], noon: [], evening: [] } } }

            // Quotation Logic
            includedItems: [], // passes, transport
            excludedItems: ['Flights', 'Visa', 'Insurance'],

            // Actions
            setTripDetails: (details) => set((state) => ({ ...state, ...details })),
            setPassengers: (pax) => set((state) => ({ passengers: { ...state.passengers, ...pax } })),
            toggleCity: (cityId) => set((state) => {
                const isSelected = state.selectedCities.includes(cityId);
                return {
                    selectedCities: isSelected
                        ? state.selectedCities.filter(c => c !== cityId)
                        : [...state.selectedCities, cityId]
                };
            }),
            // Advanced routing and itinerary generation will be added here
        }),
        {
            name: 'swiss-planner-storage',
        }
    )
);

export default usePlannerStore;
