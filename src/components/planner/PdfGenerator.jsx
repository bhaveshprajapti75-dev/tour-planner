import { useEffect, useCallback } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import usePlannerStore from '../../store/plannerStore';
import { cities, hotels, activities, sightseeings } from '../../data/mockData';
import toast from 'react-hot-toast';

// PDF Styles
const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#0F172A' },
  header: { marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#4F46E5', paddingBottom: 15 },
  logo: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#4F46E5', marginBottom: 4 },
  tagline: { fontSize: 10, color: '#64748B' },
  title: { fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 10, color: '#0F172A' },
  subtitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 8, marginTop: 16, color: '#4F46E5' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { color: '#64748B', fontSize: 10 },
  value: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginVertical: 8 },
  card: { backgroundColor: '#F8FAFC', borderRadius: 6, padding: 12, marginBottom: 8 },
  dayHeader: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: '#0F172A' },
  shiftLabel: { fontSize: 9, color: '#4F46E5', fontFamily: 'Helvetica-Bold', marginBottom: 2, textTransform: 'uppercase' },
  shiftValue: { fontSize: 10, color: '#334155', marginBottom: 6 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderTopWidth: 2, borderTopColor: '#4F46E5', marginTop: 6 },
  totalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 13, color: '#0F172A' },
  totalValue: { fontFamily: 'Helvetica-Bold', fontSize: 13, color: '#4F46E5' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#94A3B8' },
  badge: { backgroundColor: '#4F46E5', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, color: 'white', fontSize: 9, fontFamily: 'Helvetica-Bold', alignSelf: 'flex-start', marginBottom: 6 },
  tcItem: { fontSize: 8, color: '#64748B', marginBottom: 3 },
});

function SwissTourPdf({ store, quotation }) {
  const { duration, nights, category, selectedCities, cityNights, selectedHotels,
    vehicleCategory, travelType, tourManagerRequired, localGuideRequired,
    mealPreference, itinerary, startDate } = store;

  const routeName = selectedCities.map(id => cities.find(c => c.id === id)?.name).filter(Boolean).join(' → ');

  return (
    <Document>
      {/* Page 1: Overview + Itinerary */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.logo}>DigiWave</Text>
          <Text style={s.tagline}>Swiss Tour Planning | Personalized Itinerary</Text>
        </View>

        <Text style={s.title}>Switzerland Tour Plan</Text>

        {/* Trip Summary */}
        <View style={s.card}>
          <View style={s.row}><Text style={s.label}>Route</Text><Text style={s.value}>{routeName}</Text></View>
          <View style={s.row}><Text style={s.label}>Duration</Text><Text style={s.value}>{duration} Days / {nights} Nights</Text></View>
          <View style={s.row}><Text style={s.label}>Category</Text><Text style={s.value}>{(category || '').charAt(0).toUpperCase() + (category || '').slice(1)}</Text></View>
          <View style={s.row}><Text style={s.label}>Transport</Text><Text style={s.value}>{vehicleCategory} - {travelType}</Text></View>
          {startDate && <View style={s.row}><Text style={s.label}>Start Date</Text><Text style={s.value}>{startDate}</Text></View>}
        </View>

        {/* Hotels */}
        <Text style={s.subtitle}>Accommodation</Text>
        {selectedCities.map(cityId => {
          const city = cities.find(c => c.id === cityId);
          const hotel = hotels.find(h => h.id === selectedHotels[cityId]);
          return (
            <View key={cityId} style={s.card}>
              <View style={s.row}>
                <Text style={s.value}>{city?.name} ({cityNights[cityId]}N)</Text>
                <Text style={s.label}>{hotel?.name || 'TBD'}</Text>
              </View>
              {hotel && <Text style={{ ...s.label, fontSize: 8 }}>{hotel.category} | INR {hotel.price}/night</Text>}
            </View>
          );
        })}

        {/* Day-by-day */}
        <Text style={s.subtitle}>Day-by-Day Itinerary</Text>
        {itinerary.map((day) => {
          const city = cities.find(c => c.id === day.cityId);
          return (
            <View key={day.dayNum} style={s.card} wrap={false}>
              <Text style={s.dayHeader}>Day {day.dayNum} — {city?.name}{day.isDeparture ? ' (Departure)' : ''}</Text>
              {day.date && <Text style={{ ...s.label, marginBottom: 6 }}>{day.date}</Text>}
              {day.shifts?.morning && (
                <View><Text style={s.shiftLabel}>Morning</Text><Text style={s.shiftValue}>{day.shifts.morning.title || day.shifts.morning.name}</Text></View>
              )}
              {day.shifts?.noon && (
                <View><Text style={s.shiftLabel}>Afternoon</Text><Text style={s.shiftValue}>{day.shifts.noon.title || day.shifts.noon.name}</Text></View>
              )}
              {day.shifts?.evening && (
                <View><Text style={s.shiftLabel}>Evening</Text><Text style={s.shiftValue}>{day.shifts.evening.title || day.shifts.evening.name}</Text></View>
              )}
              {!day.shifts?.morning && !day.shifts?.noon && !day.shifts?.evening && !day.isDeparture && (
                <Text style={s.shiftValue}>Leisure / Free Time</Text>
              )}
            </View>
          );
        })}

        <Text style={s.footer}>Generated by DigiWave Swiss Tour Planner | Confidential</Text>
      </Page>

      {/* Page 2: Quotation + T&C */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.logo}>DigiWave</Text>
          <Text style={s.tagline}>Quotation & Terms</Text>
        </View>

        <Text style={s.title}>Cost Breakdown</Text>

        <View style={s.card}>
          {quotation.hotelCost > 0 && <View style={s.row}><Text style={s.label}>Hotels</Text><Text style={s.value}>INR {quotation.hotelCost.toLocaleString()}</Text></View>}
          {quotation.transportCost > 0 && <View style={s.row}><Text style={s.label}>Transport</Text><Text style={s.value}>INR {quotation.transportCost.toLocaleString()}</Text></View>}
          {quotation.sightseeingCost > 0 && <View style={s.row}><Text style={s.label}>Sightseeing</Text><Text style={s.value}>INR {quotation.sightseeingCost.toLocaleString()}</Text></View>}
          {quotation.activityCost > 0 && <View style={s.row}><Text style={s.label}>Activities</Text><Text style={s.value}>INR {quotation.activityCost.toLocaleString()}</Text></View>}
          {quotation.guideCost > 0 && <View style={s.row}><Text style={s.label}>Guide / Manager</Text><Text style={s.value}>INR {quotation.guideCost.toLocaleString()}</Text></View>}
          {quotation.mealCost > 0 && <View style={s.row}><Text style={s.label}>Meals</Text><Text style={s.value}>INR {quotation.mealCost.toLocaleString()}</Text></View>}
          <View style={s.divider} />
          <View style={s.row}><Text style={s.label}>Subtotal</Text><Text style={s.value}>INR {quotation.subTotal.toLocaleString()}</Text></View>
          <View style={s.row}><Text style={s.label}>GST (5%)</Text><Text style={s.value}>INR {quotation.gst.toLocaleString()}</Text></View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Grand Total</Text>
            <Text style={s.totalValue}>INR {quotation.total.toLocaleString()}</Text>
          </View>
          {quotation.totalPax > 1 && (
            <View style={s.row}><Text style={s.label}>Per Person</Text><Text style={s.value}>INR {quotation.perPerson.toLocaleString()}</Text></View>
          )}
        </View>

        {/* Inclusions */}
        <Text style={s.subtitle}>Inclusions</Text>
        <View style={s.card}>
          {selectedCities.map(id => {
            const city = cities.find(c => c.id === id);
            const hotel = hotels.find(h => h.id === selectedHotels[id]);
            return <Text key={id} style={{ ...s.label, marginBottom: 3 }}>✓ {city?.name}: {hotel?.name || 'Hotel'} ({cityNights[id]}N)</Text>;
          })}
          <Text style={{ ...s.label, marginBottom: 3 }}>✓ {vehicleCategory} Vehicle ({travelType})</Text>
          {tourManagerRequired && <Text style={{ ...s.label, marginBottom: 3 }}>✓ Tour Manager</Text>}
          {localGuideRequired && <Text style={{ ...s.label, marginBottom: 3 }}>✓ Local Guide</Text>}
          {mealPreference !== 'no_meals' && <Text style={{ ...s.label, marginBottom: 3 }}>✓ Meals ({mealPreference})</Text>}
        </View>

        {/* Exclusions */}
        <Text style={s.subtitle}>Exclusions</Text>
        <View style={s.card}>
          {['International flights & visa fees', 'Travel insurance', 'Personal expenses & tips', 'Anything not specifically mentioned above'].map(item => (
            <Text key={item} style={{ ...s.label, marginBottom: 3 }}>✗ {item}</Text>
          ))}
        </View>

        {/* Terms */}
        <Text style={s.subtitle}>Terms & Conditions</Text>
        <View style={s.card}>
          {[
            'This quotation is valid for 7 days from the date of generation.',
            'Prices are subject to availability at the time of booking.',
            '50% advance payment required to confirm the booking.',
            'Cancellation charges apply as per the cancellation policy.',
            'Force majeure events are not covered under this quotation.',
            'Exchange rate fluctuations may affect the final pricing.',
            'Any deviation in itinerary may lead to revised pricing.',
          ].map((tc, i) => (
            <Text key={i} style={s.tcItem}>{i + 1}. {tc}</Text>
          ))}
        </View>

        <Text style={s.footer}>Generated by DigiWave Swiss Tour Planner | Confidential | Page 2</Text>
      </Page>
    </Document>
  );
}

export default function PdfGenerator() {
  const store = usePlannerStore();

  const generateAndDownload = useCallback(async () => {
    try {
      const quotation = store.getQuotation();
      const storeSnapshot = {
        duration: store.duration, nights: store.nights, category: store.category,
        selectedCities: store.selectedCities, cityNights: store.cityNights,
        selectedHotels: store.selectedHotels, vehicleCategory: store.vehicleCategory,
        travelType: store.travelType, tourManagerRequired: store.tourManagerRequired,
        localGuideRequired: store.localGuideRequired, mealPreference: store.mealPreference,
        itinerary: store.itinerary, startDate: store.startDate,
      };

      const blob = await pdf(<SwissTourPdf store={storeSnapshot} quotation={quotation} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DigiWave_SwissTour_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('PDF generation failed. Please try again.');
    }
  }, [store]);

  useEffect(() => {
    const handler = () => generateAndDownload();
    window.addEventListener('download-pdf', handler);
    return () => window.removeEventListener('download-pdf', handler);
  }, [generateAndDownload]);

  // This component renders nothing - it just listens for download events
  return null;
}
