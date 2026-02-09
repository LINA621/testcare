'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const API_URL = "http://localhost:8080/api/v1"

interface Patient {
  id: string
  utilisateur?: { prenom: string; nom: string; photo_profil?: string }
  date_naissance?: string
  groupe_sanguin?: string
}

export default function AssistantPatients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/patient`)
        if (res.ok) {
          const data = await res.json()
          setPatients(data)
        }
      } catch (error) {
        console.log("[v0] Error fetching patients:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.trim() === '') {
      setFilteredPatients([])
    } else {
      const filtered = patients.filter((patient) => {
        const patientName = `${patient.utilisateur?.prenom} ${patient.utilisateur?.nom}`.toLowerCase()
        return patientName.includes(value.toLowerCase())
      })
      setFilteredPatients(filtered)
    }
  }

  const displayedPatients = searchTerm ? filteredPatients : patients

  return (
    <DashboardLayout userRole="assistant" pageTitle="Patients">
      <div className="space-y-6">
        {/* Patient Info Tabs */}
        <div className="border-b border-gray-200">
          <button className="py-3 px-0 font-semibold text-[#0066FF] border-b-2 border-[#0066FF] text-sm">
            Patient Info
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-xs"
          />
        </div>

        {/* Patients Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm">Patient Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm">Age</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm">Blood Group</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800 text-sm">Chronic Diseases</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-800 text-sm">User Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">Loading...</td>
                    </tr>
                  ) : displayedPatients.length === 0 && searchTerm ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        No patients found matching your search.
                      </td>
                    </tr>
                  ) : displayedPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        No patients found.
                      </td>
                    </tr>
                  ) : (
                    displayedPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={patient.utilisateur?.photo_profil || '/placeholder-user.jpg'}
                              alt={`${patient.utilisateur?.prenom} ${patient.utilisateur?.nom}`}
                              className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                            <span className="font-medium text-[#0A1F44]">
                              {patient.utilisateur?.prenom} {patient.utilisateur?.nom}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">-</td>
                        <td className="py-4 px-6 text-gray-700">{patient.groupe_sanguin || '-'}</td>
                        <td className="py-4 px-6 text-gray-700">-</td>
                        <td className="py-4 px-6 text-center">
                          {/* Profile Icon */}
                          <Link href={`/dashboard/assistant/patients/${patient.id}`}>
                            <button className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-700 inline-flex items-center justify-center">
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
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {displayedPatients.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Showing 1 to {displayedPatients.length} of {patients.length} patients</span>
            <div className="flex gap-2">
              <Button variant="outline" disabled className="text-gray-400">
                Previous
              </Button>
              <Button className="bg-[#0066FF] text-white hover:bg-[#0052CC] w-10 h-10 p-0">
                1
              </Button>
              <Button variant="outline" className="w-10 h-10 p-0">
                2
              </Button>
              <Button variant="outline" className="w-10 h-10 p-0">
                3
              </Button>
              <Button variant="outline" className="w-10 h-10 p-0">
                4
              </Button>
              <Button variant="outline" className="text-blue-600 hover:text-blue-700">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
