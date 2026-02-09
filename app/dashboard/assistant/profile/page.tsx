'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const API_URL = "http://localhost:8080/api/v1"

export default function AssistantProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [secretaireId, setSecretaireId] = useState<string>('')
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const storedSecretaireId = localStorage.getItem("userId")
        if (storedSecretaireId) {
          setSecretaireId(storedSecretaireId)
          const res = await fetch(`${API_URL}/secretaire/${storedSecretaireId}`)
          if (res.ok) {
            const data = await res.json()
            setFormData({
              prenom: data.utilisateur?.prenom || '',
              nom: data.utilisateur?.nom || '',
              telephone: data.utilisateur?.telephone || '',
              email: data.compte?.email || '',
            })
          }
        }
      } catch (error) {
        console.log("[v0] Error fetching assistant profile:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/secretaire/update/${secretaireId}`, {
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
    <DashboardLayout userRole="assistant" pageTitle="Profile">
      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : (
          <>
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0A1F44]">Profile</h1>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-[#0066FF] hover:bg-[#0052CC] text-white'}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {/* Profile Avatar Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0A1F44]">{formData.prenom} {formData.nom}</h2>
                    <p className="text-gray-600 mt-1">Medical Assistant</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <Input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <Input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <Input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Date Joined */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date Joined</label>
                <Input
                  type="date"
                  name="dateJoined"
                  value={formData.dateJoined}
                  onChange={handleInputChange}
                  disabled={true}
                  className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  className="bg-[#0066FF] text-white hover:bg-[#0052CC]"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Discard Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>


      </div>
    </DashboardLayout>
  )
}
