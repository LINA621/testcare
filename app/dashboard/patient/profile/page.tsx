'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const API_URL = "http://localhost:8080/api/v1"

export default function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [patientId, setPatientId] = useState<string>('')
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    date_naissance: '',
    genre: '',
    groupe_sanguin: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const storedPatientId = localStorage.getItem("userId")
        if (storedPatientId) {
          setPatientId(storedPatientId)
          const res = await fetch(`${API_URL}/patient/${storedPatientId}`)
          if (res.ok) {
            const data = await res.json()
            setFormData({
              prenom: data.utilisateur?.prenom || '',
              nom: data.utilisateur?.nom || '',
              email: data.compte?.email || '',
              telephone: data.utilisateur?.telephone || '',
              date_naissance: data.date_naissance || '',
              genre: data.genre || '',
              groupe_sanguin: data.groupe_sanguin || '',
            })
          }
        }
      } catch (error) {
        console.log('[v0] Error fetching patient profile:', error)
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

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/patient/update/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        console.log('[v0] Profile updated successfully')
        setIsEditing(false)
      }
    } catch (error) {
      console.log('[v0] Error saving patient profile:', error)
    }
  }

  return (
    <DashboardLayout userRole="patient" pageTitle="Profile">
      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0A1F44]">My Profile</h1>
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
                    <p className="text-gray-600 mt-1">Patient Member</p>
                    <p className="text-sm text-gray-500 mt-2">Blood Group: {formData.groupe_sanguin || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <Input
                      type="date"
                      name="date_naissance"
                      value={formData.date_naissance}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                    <select
                      name="groupe_sanguin"
                      value={formData.groupe_sanguin}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                <Input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Allergies</label>
              {isEditing ? (
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] resize-none"
                  placeholder="Enter allergies, one per line"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  {formData.allergies ? (
                    <div className="space-y-1 text-gray-700">
                      {formData.allergies.split(',').map((allergy, index) => (
                        <div key={index}>{allergy.trim()}</div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No allergies recorded</p>
                  )}
                </div>
              )}
            </div>

            {/* Chronic Diseases */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Chronic Diseases</label>
              {isEditing ? (
                <textarea
                  name="chronicDiseases"
                  value={formData.chronicDiseases}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] resize-none"
                  placeholder="Enter diseases, one per line"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  {formData.chronicDiseases ? (
                    <div className="space-y-1 text-gray-700">
                      {formData.chronicDiseases.split(',').map((disease, index) => (
                        <div key={index}>{disease.trim()}</div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No chronic diseases recorded</p>
                  )}
                </div>
              )}
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button onClick={handleSave} className="bg-[#0066FF] text-white hover:bg-[#0052CC]">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
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
