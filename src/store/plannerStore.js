import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cities, hotels, activities, sightseeings, getDistance } from '../data/mockData';

const usePlannerStore = create(
  persist(
    (set, get) => ({
      // === WIZARD STEP TRACKING ===
      currentStep: 1,
      totalSteps: 9,

      // === STEP 1: Duration ===
      duration: 7,
      nights: 6,
      startDate: null,

      // === STEP 2: Category ===
      category: null,
      specialOccasion: null,
      occasionAddons: [],
      rooms: [{ adults: 2, youth: 0, children: 0 }],
      soloSharing: null,

      // === STEP 3: Cities ===
      selectedCities: [],
      cityNights: {},

      // === STEP 4: Hotel Category ===
      hotelCategory: '4 Star',
      selectedHotels: {},

      // === STEP 5: Transport ===
      vehicleCategory: 'Standard',
      travelType: 'chauffeur',

      // === STEP 6: Guide ===
      tourManagerRequired: false,
      localGuideRequired: false,

      // === STEP 7: Meals ===
      mealPreference: 'no_meals',
      dietaryPreference: [],

      // === STEP 8: Sightseeing ===
      includeSightseeing: true,
      selectedSightseeings: [],

      // === STEP 9: Activities ===
      selectedActivities: [],

      // === ITINERARY (generated) ===
      itinerary: [],

      // === QUOTATION ===
      consentGiven: false,
      isQuotationVisible: false,

      // === AUTH ===
      currentUser: null,
      isLoggedIn: false,

      // === HISTORY ===
      planHistory: [],

      // ==================
      //      ACTIONS
      // ==================
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      setDuration: (days) => set({ duration: days, nights: Math.max(days - 1, 1) }),
      setStartDate: (date) => set({ startDate: date }),

      setCategory: (cat) => set({ category: cat }),
      setSpecialOccasion: (occ) => set({ specialOccasion: occ }),
      setOccasionAddons: (addons) => set({ occasionAddons: addons }),
      setSoloSharing: (type) => set({ soloSharing: type }),

      addRoom: () => set((s) => ({ rooms: [...s.rooms, { adults: 2, youth: 0, children: 0 }] })),
      removeRoom: (idx) => set((s) => ({ rooms: s.rooms.filter((_, i) => i !== idx) })),
      updateRoom: (idx, field, value) => set((s) => ({
        rooms: s.rooms.map((r, i) => i === idx ? { ...r, [field]: value } : r)
      })),

      toggleCity: (cityId) => set((s) => {
        const isSelected = s.selectedCities.includes(cityId);
        const newCities = isSelected
          ? s.selectedCities.filter(c => c !== cityId)
          : [...s.selectedCities, cityId];
        const nightsPerCity = newCities.length > 0 ? Math.max(1, Math.floor(s.nights / newCities.length)) : 0;
        const newCityNights = {};
        newCities.forEach((c, i) => {
          newCityNights[c] = i === 0 ? s.nights - (nightsPerCity * (newCities.length - 1)) : nightsPerCity;
        });
        return { selectedCities: newCities, cityNights: newCityNights };
      }),

      setCityNights: (cityId, n) => set((s) => ({ cityNights: { ...s.cityNights, [cityId]: n } })),

      setHotelCategory: (cat) => set((s) => {
        const newHotels = {};
        s.selectedCities.forEach(cityId => {
          const cityH = hotels.filter(h => h.cityId === cityId);
          const match = cityH.find(h => h.category === cat) || cityH[0];
          if (match) newHotels[cityId] = match.id;
        });
        return { hotelCategory: cat, selectedHotels: newHotels };
      }),
      setHotelForCity: (cityId, hotelId) => set((s) => ({
        selectedHotels: { ...s.selectedHotels, [cityId]: hotelId }
      })),

      setVehicleCategory: (cat) => set({ vehicleCategory: cat }),
      setTravelType: (type) => set({ travelType: type }),

      setTourManager: (val) => set({ tourManagerRequired: val }),
      setLocalGuide: (val) => set({ localGuideRequired: val }),

      setMealPreference: (pref) => set({ mealPreference: pref }),
      toggleDietary: (id) => set((s) => ({
        dietaryPreference: s.dietaryPreference.includes(id)
          ? s.dietaryPreference.filter(d => d !== id)
          : [...s.dietaryPreference, id]
      })),

      setIncludeSightseeing: (val) => set((s) => {
        if (val) {
          const auto = sightseeings.filter(sg => s.selectedCities.includes(sg.cityId)).map(sg => sg.id);
          return { includeSightseeing: val, selectedSightseeings: auto };
        }
        return { includeSightseeing: val, selectedSightseeings: [] };
      }),
      toggleSightseeing: (id) => set((s) => ({
        selectedSightseeings: s.selectedSightseeings.includes(id)
          ? s.selectedSightseeings.filter(x => x !== id)
          : [...s.selectedSightseeings, id]
      })),

      toggleActivity: (id) => set((s) => ({
        selectedActivities: s.selectedActivities.includes(id)
          ? s.selectedActivities.filter(x => x !== id)
          : [...s.selectedActivities, id]
      })),

      generateItinerary: () => set((s) => {
        const { selectedCities, cityNights, selectedActivities, selectedSightseeings, startDate } = s;
        if (selectedCities.length === 0) return {};
        const result = [];
        let dayCounter = 1;
        const baseDate = startDate ? new Date(startDate) : new Date();

        selectedCities.forEach((cityId) => {
          const nCount = cityNights[cityId] || 1;
          const cityActs = activities.filter(a => a.cityId === cityId && selectedActivities.includes(a.id));
          const citySights = sightseeings.filter(sg => sg.cityId === cityId && selectedSightseeings.includes(sg.id));
          const hotel = hotels.find(h => h.id === s.selectedHotels[cityId]);

          for (let n = 0; n < nCount; n++) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() + dayCounter - 1);
            const morningAct = cityActs.find(a => a.shift === 'Morning') || (citySights[0] ? { ...citySights[0], title: citySights[0].name, isSightseeing: true } : null);
            const noonAct = cityActs.find(a => a.shift === 'Noon') || (citySights[1] ? { ...citySights[1], title: citySights[1].name, isSightseeing: true } : null);
            const eveningAct = cityActs.find(a => a.shift === 'Evening') || null;

            result.push({
              dayNum: dayCounter,
              date: date.toISOString().split('T')[0],
              cityId,
              hotel,
              shifts: { morning: morningAct, noon: noonAct, evening: eveningAct }
            });
            dayCounter++;
          }
        });

        if (result.length < s.duration) {
          const lastCity = selectedCities[selectedCities.length - 1];
          const date = new Date(baseDate);
          date.setDate(date.getDate() + dayCounter - 1);
          result.push({
            dayNum: dayCounter, date: date.toISOString().split('T')[0], cityId: lastCity,
            hotel: null, shifts: { morning: null, noon: null, evening: null }, isDeparture: true,
          });
        }
        return { itinerary: result };
      }),

      removeActivityFromDay: (dayNum, shiftName) => set((s) => {
        const newItin = s.itinerary.map((day) => {
          if (day.dayNum === dayNum) {
            return {
              ...day,
              shifts: {
                ...day.shifts,
                [shiftName.toLowerCase()]: null
              }
            };
          }
          return day;
        });
        return { itinerary: newItin };
      }),

      getQuotation: () => {
        const s = get();
        const totalRooms = s.category === 'couple' ? 1 : s.category === 'solo' ? 1 : s.rooms.length;
        const totalPax = s.category === 'couple' ? 2 : s.category === 'solo' ? 1
          : s.rooms.reduce((acc, r) => acc + r.adults + r.youth + r.children, 0);

        let hotelCost = 0;
        s.selectedCities.forEach(cityId => {
          const hotel = hotels.find(h => h.id === s.selectedHotels[cityId]);
          const nts = s.cityNights[cityId] || 1;
          if (hotel) hotelCost += hotel.price * nts * totalRooms;
        });

        let transportKm = 0;
        for (let i = 0; i < s.selectedCities.length - 1; i++) {
          transportKm += getDistance(s.selectedCities[i], s.selectedCities[i + 1]).km;
        }
        const pricePerKm = s.vehicleCategory === 'Premium' ? 4.0 : s.vehicleCategory === 'Standard' ? 2.5 : 1.5;
        const transportCost = transportKm * pricePerKm;

        const actCost = s.selectedActivities.reduce((acc, id) => {
          const act = activities.find(a => a.id === id);
          return acc + (act ? act.price * totalPax : 0);
        }, 0);

        const sightCost = s.selectedSightseeings.reduce((acc, id) => {
          const sg = sightseeings.find(x => x.id === id);
          return acc + (sg ? sg.cost * totalPax : 0);
        }, 0);

        const guideCost = (s.tourManagerRequired ? 150 * s.duration : 0) + (s.localGuideRequired ? 100 * s.duration : 0);
        const mealPricePerDay = s.mealPreference === 'chef' ? 50 : s.mealPreference === 'local' ? 35 : 0;
        const mealCost = mealPricePerDay * s.duration * totalPax;

        const subTotal = hotelCost + transportCost + actCost + sightCost + guideCost + mealCost;
        const gst = Math.round(subTotal * 0.05);
        const total = subTotal + gst;

        return {
          hotelCost: Math.round(hotelCost), transportCost: Math.round(transportCost),
          activityCost: Math.round(actCost), sightseeingCost: Math.round(sightCost),
          guideCost: Math.round(guideCost), mealCost: Math.round(mealCost),
          subTotal: Math.round(subTotal), gst, total, totalPax, totalRooms,
          perPerson: totalPax > 0 ? Math.round(total / totalPax) : 0,
        };
      },

      setConsent: (val) => set({ consentGiven: val }),
      showQuotation: () => set({ isQuotationVisible: true }),

      login: (user) => set({ currentUser: user, isLoggedIn: true }),
      logout: () => set({ currentUser: null, isLoggedIn: false }),

      savePlan: () => set((s) => {
        const plan = {
          id: `plan_${Date.now()}`,
          name: `Swiss Tour - ${s.selectedCities.map(c => cities.find(x => x.id === c)?.name).join(', ')}`,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'draft', duration: s.duration, category: s.category,
          cities: s.selectedCities, totalAmount: s.getQuotation().total, itinerary: s.itinerary,
        };
        return { planHistory: [...s.planHistory, plan] };
      }),

      resetPlanner: () => set({
        currentStep: 1, duration: 7, nights: 6, startDate: null, category: null,
        specialOccasion: null, occasionAddons: [], rooms: [{ adults: 2, youth: 0, children: 0 }],
        soloSharing: null, selectedCities: [], cityNights: {}, hotelCategory: '4 Star',
        selectedHotels: {}, vehicleCategory: 'Standard', travelType: 'chauffeur',
        tourManagerRequired: false, localGuideRequired: false, mealPreference: 'no_meals',
        dietaryPreference: [], includeSightseeing: true, selectedSightseeings: [],
        selectedActivities: [], itinerary: [], consentGiven: false, isQuotationVisible: false,
      }),
    }),
    { name: 'swiss-planner-storage' }
  )
);

export default usePlannerStore;
