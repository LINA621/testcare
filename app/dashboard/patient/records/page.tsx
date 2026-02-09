'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const API_URL = "http://localhost:8080/api/v1"

interface Consultation {
  id: string
  date: string
  motif: string
  rapport: string
  medecin: { utilisateur?: { prenom: string; nom: string } }
}

export default function MedicalRecordsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [patientId, setPatientId] = useState<string>('')

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setIsLoading(true)
        const storedPatientId = localStorage.getItem("userId")
        if (storedPatientId) {
          setPatientId(storedPatientId)
          const res = await fetch(`${API_URL}/consultation/patient/${storedPatientId}`)
          if (res.ok) {
            const data = await res.json()
            setConsultations(data || [])
          }
        }
      } catch (error) {
        console.log('[v0] Failed to fetch consultations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConsultations()
  }, [])

  return (
    <DashboardLayout userRole="patient" pageTitle="Medical Records">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Medical Records</h1>
          <p className="text-gray-600 text-sm mt-1">View all your consultations and medical documents</p>
        </div>

        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Search consultations by doctor name, diagnosis, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-2xl"
        />

        {/* Consultations List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading consultations...</p>
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No consultations available</p>
              </div>
            ) : (
              <>
                {(() => {
                  const filteredConsultations = consultations.filter((consultation) => {
                    const searchLower = searchTerm.toLowerCase()
                    return (
                      consultation.doctorName.toLowerCase().includes(searchLower) ||
                      consultation.diagnosis.toLowerCase().includes(searchLower) ||
                      consultation.date.toLowerCase().includes(searchLower)
                    )
                  })
                  
                  return filteredConsultations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No consultations match your search</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      {/* Doctor Name and Date */}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#0A1F44]">{consultation.doctorName}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(consultation.date).toLocaleDateString()} at {consultation.time}
                        </span>
                      </div>

                      {/* Diagnosis */}
                      <div className="mb-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Diagnosis:</span> {consultation.diagnosis}
                        </p>
                      </div>

                      {/* Notes Preview */}
                      <p className="text-sm text-gray-600 line-clamp-2">{consultation.notes}</p>
                    </div>

                    {/* More Info Button */}
                    <Link href={`/dashboard/patient/records/${consultation.consultationId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4 bg-transparent hover:bg-blue-50 hover:text-[#0066FF] hover:border-[#0066FF]"
                      >
                        More Info
                      </Button>
                    </Link>
                      </div>
                      ))}
                    </div>
                  )
                })()}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
