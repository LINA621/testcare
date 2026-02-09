'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const API_URL = "http://localhost:8080/api/v1"

interface ConsultationDetail {
  id: string
  motif: string
  rapport: string
  date: string
  medecin: { utilisateur?: { prenom: string; nom: string } }
  documents: { id: string; nom: string; type: string; currentdate: string }[]
}

export default function ConsultationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string
  const consultationId = params.consultationId as string

  const [consultation, setConsultation] = useState<ConsultationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/consultation/${consultationId}`)
        if (response.ok) {
          const data = await response.json()
          setConsultation(data)
        }
      } catch (error) {
        console.log("[v0] Error fetching consultation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultation()
  }, [consultationId])

  if (loading) {
    return (
      <DashboardLayout userRole="doctor" pageTitle="Consultation Details">
        <div className="max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Loading consultation details...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!consultation) {
    return (
      <DashboardLayout userRole="doctor" pageTitle="Consultation Details">
        <div className="max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Consultation not found</p>
              <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="doctor" pageTitle="Consultation Details">
      <div className="space-y-6 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#0066FF] hover:text-[#0052CC] font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Consultations
        </button>

        {/* Consultation Header */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Doctor</p>
                <p className="text-lg font-semibold text-[#0A1F44]">
                  Dr. {consultation.medecin?.utilisateur?.prenom} {consultation.medecin?.utilisateur?.nom}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">Consultation Date</p>
                <p className="text-lg font-semibold text-[#0A1F44]">
                  {new Date(consultation.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
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
            <p className="text-gray-700 p-3 bg-gray-50 rounded-lg leading-relaxed">
              {consultation.motif || 'No motif provided'}
            </p>
          </CardContent>
        </Card>

        {/* Rapport (Report) */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Rapport</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 p-3 bg-gray-50 rounded-lg leading-relaxed">
              {consultation.rapport || 'No rapport provided'}
            </p>
          </CardContent>
        </Card>

        {/* Medical Records (Documents) */}
        {consultation.documents && consultation.documents.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consultation.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">{doc.nom}</p>
                        <p className="text-xs text-gray-600">
                          {doc.type} • {new Date(doc.currentdate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition text-[#0066FF]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          <Button
            className="flex-1 bg-[#0066FF] text-white hover:bg-[#0052CC]"
            onClick={() => router.push(`/dashboard/doctor/patients/${patientId}/consultations`)}
          >
            Back to Consultations
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
