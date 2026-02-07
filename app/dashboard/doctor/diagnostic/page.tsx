'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DiagnosticAIPage() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState('')
  const [motif, setMotif] = useState('')
  const [report, setReport] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock patients list
  const patients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Ahmed Hassan' },
  ]

  const handleSave = async () => {
    if (!selectedPatient || !motif.trim() || !report.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      // API call: POST /diagnostic/create
      console.log('[v0] Saving diagnostic:', {
        patient_id: selectedPatient,
        motif,
        rapport: report,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Reset form
      setSelectedPatient('')
      setMotif('')
      setReport('')
      
      router.push('/dashboard/doctor/diagnosis/success')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout userRole="doctor" pageTitle="Diagnostic AI">
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
            <CardTitle>Diagnostic Analysis</CardTitle>
            <p className="text-sm text-gray-600 mt-2">Create a new diagnostic record</p>
          </CardHeader>

          <CardContent className="p-8">
            <form className="space-y-6">
              {/* Select Patient */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Select Patient *
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Motif */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Motif <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-3">Reason for diagnostic consultation</p>
                <textarea
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  placeholder="Enter the reason for diagnostic consultation..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] resize-none"
                />
              </div>

              {/* Diagnostic Report */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Diagnostic Report <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-3">Detailed diagnostic analysis and findings</p>
                <textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Enter diagnostic findings and analysis..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading || !selectedPatient || !motif.trim() || !report.trim()}
                  className="flex-1 bg-[#0066FF] text-white hover:bg-[#0052CC] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Diagnostic'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="border-0 shadow-sm bg-blue-50 border border-blue-200">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900">About Diagnostic Records</p>
                <p className="text-sm text-blue-700 mt-1">
                  Enter the motif (reason for diagnostic consultation) and your detailed diagnostic report. This information will be saved to the patient's medical records.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
