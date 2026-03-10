import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { geographyAPI, templatesAPI, inclusionsAPI, plansAPI } from '../services/api';

/**
 * Evenly distribute totalDays across cities.
 * Remainder days go to earlier cities.
 * e.g. 5 days, 2 cities → [3, 2]
 */
function distributeDays(totalDays, numCities) {
  if (numCities <= 0) return [];
  const base = Math.floor(totalDays / numCities);
  const remainder = totalDays % numCities;
  return Array.from({ length: numCities }, (_, i) => base + (i < remainder ? 1 : 0));
}

const usePlannerStore = create(
  persist(
    (set, get) => ({
      // === STEP TRACKING ===
      currentStep: 1,
      totalSteps: 6,

      // === STEP 1: Country ===
      countries: [],
      countriesLoading: false,
      selectedCountry: null,

      // === STEP 2: Travel Type ===
      travelType: null,

      // === STEP 3: Duration + Date ===
      totalDays: 0,
      totalNights: 0,
      startDate: null,

      // === STEP 4: City Selection ===
      regions: [],
      regionsLoading: false,
      selectedRegions: [], // [{id, name, code, ...}] ordered list

      // === STEP 5: City-Day Allocation ===
      // [{ region: {id, name, ...}, days: N }]
      cityAllocations: [],

      // === DRAFT PLAN (auto-generated after Step 5) ===
      draftPlan: null,       // full plan object from API
      draftLoading: false,

      // === EDITABLE ITINERARY (loaded from draftPlan) ===
      // [{ dayNumber, date, regionId, regionName, templateId, templateName,
      //    includesNight, dayTourId, dayTour, planDayId }]
      editableItinerary: [],

      // === CITY TEMPLATES (for replacement in itinerary step) ===
      // { [regionId]: [template, ...] }
      cityTemplates: {},
      cityTemplatesLoading: {},

      // === SAVED / FINALIZED PLAN ===
      savedPlan: null,
      saving: false,

      // === INCLUSIONS ===
      inclusionsData: null,
      inclusionsLoading: false,
      selectedInclusions: [],

      // === LEGACY fields kept for backward compat ===
      availableDays: [],
      availableDaysLoading: false,
      templates: [],
      templatesLoading: false,
      selectedTemplate: null,
      dayTourDetails: {},
      hotels: [],
      hotelsLoading: false,
      itinerary: [],
      userPlans: [],
      userPlansLoading: false,

      // ==================
      //     ACTIONS
      // ==================
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      // --- Step 1: Country ---
      fetchCountries: async () => {
        set({ countriesLoading: true });
        try {
          const { data } = await geographyAPI.getCountries({ page_size: 50 });
          set({ countries: data.results || [], countriesLoading: false });
        } catch {
          set({ countriesLoading: false });
        }
      },

      setSelectedCountry: (country) => {
        set({
          selectedCountry: country,
          regions: [], selectedRegions: [], cityAllocations: [],
          templates: [], selectedTemplate: null, dayTourDetails: {},
          inclusionsData: null, itinerary: [], editableItinerary: [],
          draftPlan: null, savedPlan: null,
          availableDays: [], totalDays: 0, totalNights: 0,
        });
      },

      // --- Step 2: Travel Type ---
      setTravelType: (type) => set({ travelType: type }),

      // --- Step 3: Duration + Date ---
      setTotalDays: (days) => set({ totalDays: days, totalNights: Math.max(days - 1, 0) }),
      setStartDate: (date) => set({ startDate: date }),

      // Legacy: still fetches available days for old StepTemplates (if needed)
      fetchAvailableDays: async (countryId) => {
        set({ availableDaysLoading: true });
        try {
          const { travelType } = get();
          const params = { country: countryId };
          if (travelType) params.travel_type = travelType;
          const { data } = await templatesAPI.getAvailableDays(params);
          set({ availableDays: data.days || [], availableDaysLoading: false });
        } catch {
          set({ availableDaysLoading: false });
        }
      },

      // --- Step 4: City (Region) Selection ---
      fetchRegions: async (countryId) => {
        set({ regionsLoading: true });
        try {
          const { data } = await geographyAPI.getRegions({ country: countryId, page_size: 50 });
          set({ regions: data.results || [], regionsLoading: false });
        } catch {
          set({ regionsLoading: false });
        }
      },

      toggleRegion: (region) => set((s) => {
        const exists = s.selectedRegions.find(r => r.id === region.id);
        const updated = exists
          ? s.selectedRegions.filter(r => r.id !== region.id)
          : [...s.selectedRegions, region];
        // Auto-rebalance city allocations whenever region selection changes
        const days = distributeDays(s.totalDays, updated.length);
        const allocations = updated.map((r, i) => ({ region: r, days: days[i] || 1 }));
        return { selectedRegions: updated, cityAllocations: allocations };
      }),

      // --- Step 5: City-Day Adjustment ---
      /**
       * Update the day count for a city. Clamps to 1 min and totalDays max.
       * Does NOT auto-rebalance other cities — the user picks where days go.
       */
      setCityDays: (regionId, newDays) => set((s) => {
        const allocs = s.cityAllocations.map(a => ({ ...a }));
        const idx = allocs.findIndex(a => a.region.id === regionId);
        if (idx === -1) return {};
        const othersTotal = allocs.reduce((t, a, i) => i !== idx ? t + a.days : t, 0);
        const clampedNew = Math.max(1, Math.min(newDays, s.totalDays - othersTotal));
        if (clampedNew === allocs[idx].days) return {};
        allocs[idx].days = clampedNew;
        return { cityAllocations: allocs };
      }),

      removeCity: (regionId) => set((s) => {
        const updated = s.selectedRegions.filter(r => r.id !== regionId);
        const days = distributeDays(s.totalDays, updated.length);
        const allocations = updated.map((r, i) => ({ region: r, days: days[i] || 1 }));
        return { selectedRegions: updated, cityAllocations: allocations };
      }),

      addCity: (region) => set((s) => {
        if (s.selectedRegions.find(r => r.id === region.id)) return {};
        if (s.cityAllocations.reduce((t, a) => t + a.days, 0) >= s.totalDays) return {};
        const updated = [...s.selectedRegions, region];
        const days = distributeDays(s.totalDays, updated.length);
        const allocations = updated.map((r, i) => ({ region: r, days: days[i] || 1 }));
        return { selectedRegions: updated, cityAllocations: allocations };
      }),

      // --- Auto-Generate Draft Plan ---
      autoGenerateDraft: async () => {
        const { selectedCountry, totalDays, startDate, travelType, cityAllocations } = get();
        if (!selectedCountry || !totalDays || cityAllocations.length === 0) return null;
        set({ draftLoading: true });
        try {
          const payload = {
            country: selectedCountry.id,
            total_days: totalDays,
            start_date: startDate || null,
            travel_type: travelType || null,
            city_allocations: cityAllocations.map(a => ({
              region: a.region.id,
              days: a.days,
            })),
          };
          const { data: plan } = await plansAPI.autoGenerateDraft(payload);
          // Build editable itinerary from plan days
          const editable = _buildEditableItinerary(plan, startDate);
          set({ draftPlan: plan, editableItinerary: editable, draftLoading: false });
          return plan;
        } catch (e) {
          set({ draftLoading: false });
          throw e;
        }
      },

      // --- Itinerary Editing ---
      /**
       * Swap the template for a specific day.
       * Calls PATCH /user-plans/plan-days/{id}/ with new template + day_tour.
       */
      updateDayTemplate: async (planDayId, template) => {
        const dayTour = template.days?.[0]?.day_tour || null;
        const dayTourObj = template.days?.[0]?.day_tour_detail || null;
        await plansAPI.updatePlanDay(planDayId, {
          template: template.id,
          day_tour: dayTour,
        });
        set((s) => ({
          editableItinerary: s.editableItinerary.map(d =>
            d.planDayId === planDayId
              ? { ...d, templateId: template.id, templateName: template.name, includesNight: template.includes_night, dayTourId: dayTour, dayTour: dayTourObj }
              : d
          ),
        }));
      },

      /**
       * Assign or change hotel for a specific plan day.
       * Calls PATCH /user-plans/plan-days/{id}/ with hotel id.
       */
      setDayHotel: async (planDayId, hotel) => {
        await plansAPI.updatePlanDay(planDayId, { hotel: hotel?.id || null });
        set((s) => ({
          editableItinerary: s.editableItinerary.map(d =>
            d.planDayId === planDayId
              ? { ...d, hotelId: hotel?.id || null, hotelName: hotel?.name || null, hotelStarRating: hotel?.star_rating || null, hotelPricePerNight: hotel?.price_per_night ? Number(hotel.price_per_night) : 0 }
              : d
          ),
        }));
      },

      // Fetch templates for a specific region (used in Replace Template modal)
      fetchCityTemplates: async (regionId) => {
        if (get().cityTemplates[regionId]) return; // already loaded
        set((s) => ({ cityTemplatesLoading: { ...s.cityTemplatesLoading, [regionId]: true } }));
        try {
          const { travelType } = get();
          const params = { region: regionId, page_size: 50 };
          if (travelType) params.travel_type = travelType;
          const { data } = await templatesAPI.getTemplates(params);
          set((s) => ({
            cityTemplates: { ...s.cityTemplates, [regionId]: data.results || [] },
            cityTemplatesLoading: { ...s.cityTemplatesLoading, [regionId]: false },
          }));
        } catch {
          set((s) => ({ cityTemplatesLoading: { ...s.cityTemplatesLoading, [regionId]: false } }));
        }
      },

      // --- Finalize Plan ---
      finalizePlan: async () => {
        const { draftPlan } = get();
        if (!draftPlan) return null;
        set({ saving: true });
        try {
          const { data: plan } = await plansAPI.finalizePlan(draftPlan.id);
          set({ savedPlan: plan, draftPlan: plan, saving: false });
          return plan;
        } catch (e) {
          set({ saving: false });
          throw e;
        }
      },

      // --- Refresh Draft Plan (re-fetch from API to get updated incl_excl etc.) ---
      refreshDraftPlan: async () => {
        const { draftPlan, startDate } = get();
        if (!draftPlan?.id) return;
        try {
          const { data: plan } = await plansAPI.getPlan(draftPlan.id);
          const editable = _buildEditableItinerary(plan, startDate);
          set({ draftPlan: plan, editableItinerary: editable });
        } catch { /* silent */ }
      },

      // --- PDF Download ---
      downloadPdf: async (planId) => {
        const { data } = await plansAPI.exportPdf(planId);
        const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `itinerary-${planId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },

      // --- Inclusions ---
      fetchInclusions: async (countryId) => {
        set({ inclusionsLoading: true });
        try {
          const { data } = await inclusionsAPI.getGrouped({ country: countryId });
          set({ inclusionsData: data, inclusionsLoading: false });
        } catch {
          set({ inclusionsLoading: false });
        }
      },
      toggleInclusion: (id) => set((s) => ({
        selectedInclusions: s.selectedInclusions.includes(id)
          ? s.selectedInclusions.filter(i => i !== id)
          : [...s.selectedInclusions, id],
      })),

      // --- Legacy: buildItinerary (kept for /planner/itinerary backward compat) ---
      buildItinerary: () => {
        const { draftPlan, startDate } = get();
        if (!draftPlan) return;
        const editable = _buildEditableItinerary(draftPlan, startDate);
        set({ itinerary: editable, editableItinerary: editable });
      },

      // --- User Plans History ---
      fetchUserPlans: async () => {
        set({ userPlansLoading: true });
        try {
          const { data } = await plansAPI.getPlans({ page_size: 50 });
          set({ userPlans: data.results || [], userPlansLoading: false });
        } catch {
          set({ userPlansLoading: false });
        }
      },
      deletePlan: async (id) => {
        await plansAPI.deletePlan(id);
        set((s) => ({ userPlans: s.userPlans.filter(p => p.id !== id) }));
      },
      clonePlan: async (id) => {
        const { data } = await plansAPI.clonePlan(id);
        await get().fetchUserPlans();
        return data;
      },

      // --- Reset ---
      resetPlanner: () => set({
        currentStep: 1,
        selectedCountry: null,
        travelType: null,
        totalDays: 0, totalNights: 0, startDate: null,
        availableDays: [],
        regions: [], selectedRegions: [], cityAllocations: [],
        templates: [], selectedTemplate: null, dayTourDetails: {},
        inclusionsData: null, selectedInclusions: [],
        itinerary: [], editableItinerary: [],
        draftPlan: null, savedPlan: null,
        cityTemplates: {}, cityTemplatesLoading: {},
      }),
    }),
    {
      name: 'tour-planner-wizard',
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedCountry: state.selectedCountry,
        travelType: state.travelType,
        totalDays: state.totalDays,
        totalNights: state.totalNights,
        startDate: state.startDate,
        selectedRegions: state.selectedRegions,
        cityAllocations: state.cityAllocations,
        draftPlan: state.draftPlan,
        savedPlan: state.savedPlan,
        editableItinerary: state.editableItinerary,
        selectedInclusions: state.selectedInclusions,
      }),
    }
  )
);

/** Build the editable itinerary array from a full UserPlan API response. */
function _buildEditableItinerary(plan, startDate) {
  const sorted = [...(plan.days || [])].sort((a, b) => a.day_number - b.day_number);
  let baseDate = null;
  if (startDate) {
    const [y, m, d] = startDate.split('-').map(Number);
    baseDate = new Date(y, m - 1, d);
  } else {
    baseDate = new Date();
  }
  const fmt = (dt) => {
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${dt.getFullYear()}`;
  };
  return sorted.map((d) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + d.day_number - 1);
    return {
      planDayId: d.id,
      dayNumber: d.day_number,
      date: fmt(date),
      regionId: d.region,
      regionName: d.region_name || '',
      templateId: d.template,
      templateName: d.template_name || '',
      includesNight: d.includes_night || false,
      dayTourId: d.day_tour,
      dayTour: d.day_tour_detail || null,
      hotelId: d.hotel || null,
      hotelName: d.hotel_name || null,
      hotelStarRating: d.hotel_star_rating || null,
      hotelPricePerNight: d.hotel_price_per_night ? Number(d.hotel_price_per_night) : 0,
    };
  });
}

export default usePlannerStore;
