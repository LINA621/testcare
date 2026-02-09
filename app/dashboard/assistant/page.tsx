"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const API_URL = "http://localhost:8080/api/v1"

export default function AssistantDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
  })
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [secretaireId, setSecretaireId] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const storedSecretaireId = localStorage.getItem("userId")
        if (storedSecretaireId) {
          setSecretaireId(storedSecretaireId)

          // Fetch all appointments: GET /rendezvous
          const appointmentsRes = await fetch(`${API_URL}/rendezvous`)
          const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : []

          // Fetch all patients: GET /patient
          const patientsRes = await fetch(`${API_URL}/patient`)
          const patientsData = patientsRes.ok ? await patientsRes.json() : []

          // Get today's appointments
          const today = new Date().toISOString().split("T")[0]
          const todayAppts = appointmentsData.filter(
            (appt: any) => appt.date && appt.date.split("T")[0] === today
          )

          setStats({
            totalAppointments: appointmentsData.length,
            todayAppointments: todayAppts.length,
            totalPatients: patientsData.length,
          })

          // Set recent appointments
          setRecentAppointments(
            appointmentsData.slice(0, 5).map((appt: any) => ({
              id: appt.id,
              date: appt.date,
              statut: appt.statut,
              raison: appt.raison,
              patient: appt.patient?.utilisateur,
              medecin: appt.medecin?.utilisateur,
            }))
          )
        }
        setIsLoading(false)
      } catch (error) {
        console.log("[v0] Failed to fetch assistant data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <DashboardLayout userRole="assistant" pageTitle="Assistant Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F44] mb-2">Welcome back, Secretary!</h1>
          <p className="text-gray-600">Manage appointments and patient inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
                  <p className="text-3xl font-bold text-[#0A1F44]">{isLoading ? "-" : stats.totalAppointments}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center opacity-60">
                  <svg className="w-6 h-6 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Today's Appointments</p>
                  <p className="text-3xl font-bold text-[#0A1F44]">{isLoading ? "-" : stats.todayAppointments}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center opacity-60">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                  <p className="text-3xl font-bold text-[#0A1F44]">{isLoading ? "-" : stats.totalPatients}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center opacity-60">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>



        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-gray-500">Loading appointments...</p>
            ) : recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-[#0A1F44]">
                        {appt.patient?.prenom} {appt.patient?.nom}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Doctor: Dr. {appt.medecin?.prenom} {appt.medecin?.nom}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(appt.date).toLocaleDateString()} - {appt.raison}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appt.statut === 'Confirmed'
                        ? 'bg-green-50 text-green-700'
                        : appt.statut === 'Annule'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {appt.statut}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No appointments yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
