'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ConsultationDetail {
  id: number
  doctorName: string
  date: string
  time: string
  motif: string
  rapport: string
  documents: Array<{
    id: number
    name: string
    type: string
    url: string
    uploadedDate: string
  }>
}

// Mock consultation data (would come from database)
const consultationData: { [key: string]: ConsultationDetail } = {
  '1': {
    id: 1,
    doctorName: 'Dr. Michael Lee',
    date: '2024-12-28',
    time: '10:30 AM',
    motif: 'Seasonal Flu symptoms - fever, cough, and body aches',
    rapport: 'Patient presented with fever, cough, and body aches. After thorough examination and vital sign assessment, confirmed seasonal flu diagnosis. Patient was advised rest, hydration, and prescribed appropriate medications.',
    documents: [
      {
        id: 1,
        name: 'Consultation Report',
        type: 'PDF',
        url: '#',
        uploadedDate: '2024-12-28',
      },
      {
        id: 2,
        name: 'Blood Test Results',
        type: 'PDF',
        url: '#',
        uploadedDate: '2024-12-28',
      },
    ],
  },
  '2': {
    id: 2,
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-11-15',
    time: '02:00 PM',
    motif: 'Annual health checkup',
    rapport: 'Comprehensive annual health examination completed. All vital signs normal, weight stable, BMI in healthy range. Patient is maintaining excellent health with regular exercise and balanced diet.',
    documents: [
      {
        id: 3,
        name: 'Annual Checkup Report',
        type: 'PDF',
        url: '#',
        uploadedDate: '2024-11-15',
      },
      {
        id: 4,
        name: 'Lab Work Summary',
        type: 'PDF',
        url: '#',
        uploadedDate: '2024-11-15',
      },
    ],
  },
  '3': {
    id: 3,
    doctorName: 'Dr. Ahmad Hassan',
    date: '2024-10-20',
    time: '09:00 AM',
    motif: 'Hypertension Follow-up',
    rapport: 'Follow-up consultation for hypertension management. Blood pressure reading: 145/92 mmHg - slightly elevated. Current medication reviewed and adjusted. Patient counseled on dietary modifications and stress reduction.',
    documents: [
      {
        id: 5,
        name: 'Hypertension Assessment',
        type: 'PDF',
        url: '#',
        uploadedDate: '2024-10-20',
      },
      {
        id: 6,
        name: 'Blood Pressure Log',
        type: 'PDF',
        url: '#',
        uploadedDate: '2024-10-20',
      },
      {
        id: 7,
        name: 'Diet Recommendations',
        type: 'PDF',
        url: '#',
        uploadedDate: '2024-10-20',
      },
    ],
  },
}

export default function ConsultationDetailPage() {
  const params = useParams()
  const consultationId = params.id as string

  const [consultation, setConsultation] = useState<ConsultationDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // API_ENDPOINT: GET /api/medical-records/consultations/{consultation_id}
    // Response: consultation details from consultations + document_medical tables
    const fetchConsultation = async () => {
      setIsLoading(true)
      try {
        // In production:
        // const response = await fetch(`/api/medical-records/consultations/${consultationId}`)
        // const data = await response.json()
        // setConsultation(data)

        if (consultationData[consultationId]) {
          setConsultation(consultationData[consultationId])
        }

        console.log('[v0] Fetched consultation details:', consultationId)
      } catch (error) {
        console.error('[v0] Failed to fetch consultation details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConsultation()
  }, [consultationId])

  if (isLoading) {
    return (
      <DashboardLayout userRole="patient" pageTitle="Consultation Details">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Loading consultation details...</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  if (!consultation) {
    return (
      <DashboardLayout userRole="patient" pageTitle="Consultation Details">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">Consultation not found</p>
            <Link href="/dashboard/patient/records">
              <Button className="bg-[#0066FF] text-white hover:bg-[#0052CC]">Back to Medical Records</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="patient" pageTitle="Consultation Details">
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/dashboard/patient/records">
          <Button variant="outline" className="bg-transparent">
            ← Back to Medical Records
          </Button>
        </Link>

        {/* Consultation Header */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Doctor</p>
                <h1 className="text-3xl font-bold text-[#0A1F44]">{consultation.doctorName}</h1>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(consultation.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  at {consultation.time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motif (Reason for visit) */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Motif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 p-3 bg-gray-50 rounded-lg leading-relaxed">{consultation.motif}</p>
          </CardContent>
        </Card>

        {/* Rapport (Report) */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Rapport</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 p-3 bg-gray-50 rounded-lg leading-relaxed">{consultation.rapport}</p>
          </CardContent>
        </Card>

        {/* Documents Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Medical Documents & Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {consultation.documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No documents available for this consultation</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultation.documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Document Icon */}
                      <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
                          <path d="M6 7a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1zm4 0a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1zm4 0a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z" />
                        </svg>
                      </div>

                      {/* Document Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900">{document.name}</h4>
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {document.type}
                          </span>
                          <span className="text-xs text-gray-600">
                            {new Date(document.uploadedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <a href={document.url} download>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent hover:bg-blue-50 hover:text-[#0066FF] hover:border-[#0066FF]"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>


      </div>
    </DashboardLayout>
  )
}
