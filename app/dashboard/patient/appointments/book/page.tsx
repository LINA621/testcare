import { Suspense } from 'react'
import { BookAppointmentContent } from './BookAppointmentContent'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'

function LoadingFallback() {
  return (
    <DashboardLayout userRole="patient" pageTitle="Book Appointment">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookAppointmentContent />
    </Suspense>
  )
}
