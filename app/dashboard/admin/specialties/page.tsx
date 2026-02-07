"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const API_URL = "http://localhost:8080/api/v1"

export default function SpecialtiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [specialties, setSpecialties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newSpecialtyName, setNewSpecialtyName] = useState("")
  const [newSpecialtyDesc, setNewSpecialtyDesc] = useState("")

  // Fetch specialties from API
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/specialite`)
        if (response.ok) {
          const data = await response.json()
          const formattedSpecialties = data.map((spec: any) => ({
            id: spec.id,
            nom: spec.nom,
            description: spec.description,
            doctorCount: 0, // Would be calculated from doctors with this specialty
          }))
          setSpecialties(formattedSpecialties)
        }
      } catch (error) {
        console.log("[v0] Error fetching specialties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  const filteredSpecialties = specialties.filter(
    (s) =>
      s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/specialite/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setSpecialties(specialties.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.log("[v0] Error deleting specialty:", error)
    }
  }

  const handleAddSpecialty = async () => {
    if (!newSpecialtyName.trim()) {
      alert("Please enter a specialty name")
      return
    }

    try {
      const response = await fetch(`${API_URL}/specialite/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: newSpecialtyName,
          description: newSpecialtyDesc || null,
        }),
      })

      if (response.ok) {
        const newSpecialty = await response.json()
        setSpecialties([...specialties, {
          id: newSpecialty.id,
          nom: newSpecialty.nom,
          description: newSpecialty.description,
          doctorCount: 0,
        }])
        setNewSpecialtyName("")
        setNewSpecialtyDesc("")
        setShowModal(false)
      }
    } catch (error) {
      console.log("[v0] Error adding specialty:", error)
      alert("Failed to add specialty")
    }
  }

  return (
    <DashboardLayout userRole="admin" pageTitle="Specialties">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0A1F44]">Medical Specialties</h1>
          <Button onClick={() => setShowModal(true)} className="bg-[#0066FF] text-white hover:bg-[#0052CC]">
            + Add Specialty
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                type="text"
                placeholder="Search specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Specialties Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Specialty Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Description</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Doctors</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500">
                        Loading specialties...
                      </td>
                    </tr>
                  ) : filteredSpecialties.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500">
                        No specialties found
                      </td>
                    </tr>
                  ) : (
                    filteredSpecialties.map((specialty) => (
                      <tr key={specialty.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-4 px-6 text-gray-700 font-medium">{specialty.nom}</td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{specialty.description || "-"}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-[#0066FF]">
                            {specialty.doctorCount} Doctors
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleDelete(specialty.id)}
                            className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md m-0">
              <div className="bg-[#1e3a8a] p-6 flex items-center justify-between">
                <span className="text-xl font-bold text-white">
                  <span className="text-[#0066FF]">Med</span>
                  <span className="text-white">Care</span>
                </span>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-[#0052CC] p-1">
                  ✕
                </button>
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#0A1F44] mb-4">Add Specialty</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty Name *</label>
                    <Input 
                      type="text" 
                      placeholder="e.g., Cardiology"
                      value={newSpecialtyName}
                      onChange={(e) => setNewSpecialtyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Describe this specialty..."
                      value={newSpecialtyDesc}
                      onChange={(e) => setNewSpecialtyDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddSpecialty}
                      className="flex-1 bg-[#0066FF] text-white hover:bg-[#0052CC]"
                    >
                      Add Specialty
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
