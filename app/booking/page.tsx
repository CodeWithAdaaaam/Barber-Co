import { getServices, getBarbers } from '@/lib/api';
import BookingForm from '@/components/BookingForm';
export const revalidate = 3600; 

export default async function BookingPage() {
  const [services, barbers] = await Promise.all([
    getServices(),
    getBarbers()
  ]);

  return (
    <BookingForm 
      services={services || []} 
      barbers={barbers || []} 
    />
  );
}