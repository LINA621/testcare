'use client'

import React, { useState, useEffect } from "react"
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const API_URL = "http://localhost:8080/api/v1"

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [doctorId, setDoctorId] = useState<string>('')
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    specialite: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const storedDoctorId = localStorage.getItem("userId")
        if (storedDoctorId) {
          setDoctorId(storedDoctorId)
          const res = await fetch(`${API_URL}/medecin/${storedDoctorId}`)
          if (res.ok) {
            const data = await res.json()
            setFormData({
              prenom: data.utilisateur?.prenom || '',
              nom: data.utilisateur?.nom || '',
              telephone: data.utilisateur?.telephone || '',
              email: data.compte?.email || '',
              specialite: data.specialite?.libelle || '',
            })
          }
        }
      } catch (error) {
        console.log("[v0] Error fetching doctor profile:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/medecin/update/${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        console.log("[v0] Profile updated successfully")
        setIsEditing(false)
      }
    } catch (error) {
      console.log("[v0] Error updating profile:", error)
    }
  }

  return (
    <DashboardLayout userRole="doctor" pageTitle="Profile">
      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0A1F44]">Profile</h1>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="bg-[#0066FF] text-white hover:bg-[#0052CC]">
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Profile Card */}
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSaveProfile} className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#0A1F44] mb-6">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">First Name</label>
                        <Input
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          placeholder="Enter first name"
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Last Name</label>
                        <Input
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          placeholder="Enter last name"
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email"
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
                        <Input
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">License Number</label>
                    <Input
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="Enter license number"
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h2 className="text-lg font-semibold text-[#0A1F44] mb-6">Professional Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Specialization</label>
                    <Input
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g., Cardiology"
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#0066FF] text-white hover:bg-[#0052CC]">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>


      </div>
    </DashboardLayout>
  )
}
