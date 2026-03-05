import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { geographyAPI, templatesAPI, dayToursAPI, inclusionsAPI, hotelsAPI, plansAPI } from '../services/api';

const usePlannerStore = create(
  persist(
    (set, get) => ({
      // === WIZARD STEP TRACKING ===
      currentStep: 1,
      totalSteps: 5,

      // === STEP 1: Country ===
      countries: [],
      countriesLoading: false,
      selectedCountry: null,

      // === STEP 2: Travel Type ===
      travelType: null, // GROUP, SOLO, COUPLE

      // === STEP 3: Duration + Date ===
      totalDays: 7,
      totalNights: 6,
      startDate: null,

      // === STEP 2: Regions/Cities ===
      regions: [],
      regionsLoading: false,
      selectedRegions: [],

      // === STEP 3: Template Selection + Day Tours ===
      templates: [],
      templatesLoading: false,
      selectedTemplate: null,
      dayTourDetails: {}, // { dayTourId: fullDayTourObject }
      dayToursLoading: false,

      // === Inclusions / Exclusions ===
      inclusionsData: null, // { INCLUSION: {...}, EXCLUSION: {...} }
      inclusionsLoading: false,
      selectedInclusions: [], // IDs of incl/excl items user has selected

      // === Hotels (optional) ===
      hotels: [],
      hotelsLoading: false,

      // === GENERATED ITINERARY ===
      itinerary: [], // built from template days + dayTour details

      // === SAVED PLAN ===
      savedPlan: null,
      saving: false,

      // === USER PLANS HISTORY ===
      userPlans: [],
      userPlansLoading: false,

      // ==================
      //      ACTIONS
      // ==================
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      // --- Step 1 ---
      fetchCountries: async () => {
        set({ countriesLoading: true });
        try {
          const { data } = await geographyAPI.getCountries({ page_size: 50 });
          set({ countries: data.results || [], countriesLoading: false });
        } catch {
          set({ countriesLoading: false });
        }
      },

      setSelectedCountry: (country) => set({
        selectedCountry: country,
        regions: [],
        selectedRegions: [],
        templates: [],
        selectedTemplate: null,
        dayTourDetails: {},
        inclusionsData: null,
        itinerary: [],
      }),

      setTravelType: (type) => set({ travelType: type }),
      setTotalDays: (days) => set({ totalDays: days, totalNights: Math.max(days - 1, 1) }),
      setStartDate: (date) => set({ startDate: date }),

      // --- Step 2 ---
      fetchRegions: async (countryId) => {
        set({ regionsLoading: true });
        try {
          const { data } = await geographyAPI.getRegions({ country: countryId, page_size: 50 });
          set({ regions: data.results || [], regionsLoading: false });
        } catch {
          set({ regionsLoading: false });
        }
      },

      toggleRegion: (regionId) => set((s) => {
        const isSelected = s.selectedRegions.includes(regionId);
        return {
          selectedRegions: isSelected
            ? s.selectedRegions.filter(r => r !== regionId)
            : [...s.selectedRegions, regionId]
        };
      }),

      // --- Step 3 ---
      fetchTemplates: async (countryId, totalDays) => {
        set({ templatesLoading: true });
        try {
          const { data } = await templatesAPI.getTemplates({
            country: countryId,
            total_days: totalDays,
            page_size: 50,
          });
          set({ templates: data.results || [], templatesLoading: false });
        } catch {
          set({ templatesLoading: false });
        }
      },

      selectTemplate: (template) => {
        // Extract day tour details from nested day_tour_detail in template response
        const details = { ...get().dayTourDetails };
        for (const day of (template.days || [])) {
          if (day.day_tour_detail && day.day_tour) {
            details[day.day_tour] = day.day_tour_detail;
          }
        }
        // Auto-init inclusions from template's attached incl/excl
        const inclIds = (template.incl_excl || []).map(ie => ie.incl_excl);
        set({ selectedTemplate: template, dayTourDetails: details, dayToursLoading: false, selectedInclusions: inclIds });
        // Also fetch grouped inclusions for display if not loaded yet
        const { inclusionsData, selectedCountry } = get();
        if (!inclusionsData && selectedCountry) {
          get().fetchInclusions(selectedCountry.id);
        }
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

      toggleInclusion: (id) => set((s) => {
        const isSelected = s.selectedInclusions.includes(id);
        return {
          selectedInclusions: isSelected
            ? s.selectedInclusions.filter(i => i !== id)
            : [...s.selectedInclusions, id]
        };
      }),

      setSelectedInclusions: (ids) => set({ selectedInclusions: ids }),

      // Initialize inclusions from template's attached incl/excl
      initInclusionsFromTemplate: () => {
        const { selectedTemplate } = get();
        if (selectedTemplate?.incl_excl) {
          const ids = selectedTemplate.incl_excl.map(ie => ie.incl_excl);
          set({ selectedInclusions: ids });
        }
      },

      // --- Hotels ---
      fetchHotels: async (regionId) => {
        set({ hotelsLoading: true });
        try {
          const { data } = await hotelsAPI.getHotels({ region: regionId, page_size: 50 });
          set({ hotels: data.results || [], hotelsLoading: false });
        } catch {
          set({ hotelsLoading: false });
        }
      },

      // --- Build Itinerary from Template ---
      buildItinerary: () => {
        const { selectedTemplate, dayTourDetails, startDate } = get();
        if (!selectedTemplate) return;

        const days = [...(selectedTemplate.days || [])].sort((a, b) => a.day_number - b.day_number);
        const baseDate = startDate ? new Date(startDate) : new Date();

        const itinerary = days.map((d) => {
          const date = new Date(baseDate);
          date.setDate(date.getDate() + d.day_number - 1);
          // Use nested day_tour_detail first, fall back to separately fetched details
          const tour = d.day_tour_detail || dayTourDetails[d.day_tour] || null;

          return {
            dayNumber: d.day_number,
            date: date.toISOString().split('T')[0],
            isArrival: d.is_arrival_day,
            isDeparture: d.is_departure_day,
            dayTourId: d.day_tour,
            dayTour: tour,
            templateDayId: d.id,
          };
        });

        set({ itinerary });
      },

      // --- Save Plan to Backend ---
      savePlan: async ({ name, clientName, clientEmail, clientPhone, notes } = {}) => {
        const { selectedCountry, selectedTemplate, totalDays, totalNights, startDate, itinerary, selectedInclusions, savedPlan: existingPlan } = get();
        if (!selectedCountry) return null;

        set({ saving: true });
        try {
          const planPayload = {
            country: selectedCountry.id,
            based_on_template: selectedTemplate?.id || null,
            name: name || `${selectedCountry.name} ${totalDays}D Tour`,
            total_days: totalDays,
            total_nights: totalNights,
            start_date: startDate || null,
            client_name: clientName || null,
            client_email: clientEmail || null,
            client_phone: clientPhone || null,
            notes: notes || null,
            status: 'DRAFT',
          };

          let plan;
          if (existingPlan?.id) {
            // Update existing plan
            const { data } = await plansAPI.updatePlan(existingPlan.id, planPayload);
            plan = data;

            // Delete old days and inclusions, then re-create
            if (existingPlan.days?.length) {
              await Promise.all(existingPlan.days.map(d => plansAPI.deletePlanDay(d.id)));
            }
            if (existingPlan.incl_excl?.length) {
              await Promise.all(existingPlan.incl_excl.map(ie => plansAPI.deletePlanInclExcl(ie.id)));
            }
          } else {
            // Create new plan
            const { data } = await plansAPI.createPlan(planPayload);
            plan = data;
          }

          // Create plan days
          await Promise.all(
            itinerary.map((day) =>
              plansAPI.createPlanDay({
                user_plan: plan.id,
                day_number: day.dayNumber,
                day_tour: day.dayTourId,
              })
            )
          );

          // Add selected inclusions/exclusions
          if (selectedInclusions.length > 0) {
            await Promise.all(
              selectedInclusions.map((inclId) =>
                plansAPI.createPlanInclExcl({
                  user_plan: plan.id,
                  incl_excl: inclId,
                })
              )
            );
          }

          // Fetch the complete saved plan
          const { data: savedPlan } = await plansAPI.getPlan(plan.id);
          set({ savedPlan, saving: false });
          return savedPlan;
        } catch (e) {
          set({ saving: false });
          throw e;
        }
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
        totalDays: 7,
        totalNights: 6,
        startDate: null,
        regions: [],
        selectedRegions: [],
        templates: [],
        selectedTemplate: null,
        dayTourDetails: {},
        inclusionsData: null,
        selectedInclusions: [],
        hotels: [],
        itinerary: [],
        savedPlan: null,
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
        selectedTemplate: state.selectedTemplate,
      }),
    }
  )
);

export default usePlannerStore;
