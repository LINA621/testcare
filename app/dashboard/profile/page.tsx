"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const API_URL = "http://localhost:8080/api/v1"

export default function ProfilePage() {
  const [userRole, setUserRole] = useState<string>("")
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        // Get user role from localStorage or session
        const role = localStorage.getItem("userRole") || "patient"
        const userId = localStorage.getItem("userId")
        
        setUserRole(role)

        if (!userId) {
          console.log("[v0] No user ID found")
          return
        }

        // Fetch profile based on user role
        let endpoint = ""
        switch (role) {
          case "medecin":
          case "doctor":
            endpoint = `${API_URL}/medecin/${userId}`
            break
          case "secretaire":
          case "assistant":
            endpoint = `${API_URL}/secretaire/${userId}`
            break
          case "patient":
          default:
            endpoint = `${API_URL}/patient/${userId}`
            break
        }

        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          setFormData({
            nom: data.utilisateur?.nom || "",
            prenom: data.utilisateur?.prenom || "",
            email: data.compte?.email || "",
            telephone: data.utilisateur?.telephone || "",
            adresse: data.utilisateur?.adresse || "",
            date_naissance: data.utilisateur?.date_naissance || "",
            sexe: data.utilisateur?.sexe || "",
            cin: data.utilisateur?.cin || "",
          })
        }
      } catch (error) {
        console.log("[v0] Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const role = localStorage.getItem("userRole") || "patient"

      if (!userId) {
        alert("User ID not found")
        return
      }

      // Determine update endpoint
      let endpoint = ""
      let httpMethod = "PUT"

      switch (role) {
        case "medecin":
        case "doctor":
          endpoint = `${API_URL}/medecin/${userId}`
          break
        case "secretaire":
        case "assistant":
          endpoint = `${API_URL}/secretaire/${userId}`
          break
        case "patient":
        default:
          endpoint = `${API_URL}/patient/${userId}`
          break
      }

      const response = await fetch(endpoint, {
        method: httpMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utilisateur: {
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            adresse: formData.adresse,
            date_naissance: formData.date_naissance,
            sexe: formData.sexe,
            cin: formData.cin,
          },
          compte: {
            email: formData.email,
          },
        }),
      })

      if (response.ok) {
        alert("Profile updated successfully")
        setIsEditing(false)
        // Refresh profile
        window.location.reload()
      } else {
        alert("Failed to update profile")
      }
    } catch (error) {
      console.log("[v0] Error updating profile:", error)
      alert("Error updating profile")
    }
  }

  if (loading) {
    return (
      <DashboardLayout userRole={userRole} pageTitle="Profile">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout userRole={userRole} pageTitle="Profile">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">No profile data found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole={userRole} pageTitle="Profile">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-[#0A1F44] mb-8">My Profile</h1>

        {/* Profile Header */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1F44]">
                  {profile.utilisateur?.prenom} {profile.utilisateur?.nom}
                </h2>
                <p className="text-gray-600 mt-2">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {new Date(profile.compte?.currentdate).toLocaleDateString()}
                </p>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-[#0066FF] text-white hover:bg-[#0052CC]"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      name="date_naissance"
                      value={formData.date_naissance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID/CIN
                    </label>
                    <Input
                      name="cin"
                      value={formData.cin}
                      onChange={handleInputChange}
                      placeholder="ID/CIN"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Input
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    placeholder="Address"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-[#0066FF] text-white hover:bg-[#0052CC]"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">First Name</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profile.utilisateur?.prenom || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Name</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profile.utilisateur?.nom || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-medium text-gray-900">
                    {profile.compte?.email || "-"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profile.utilisateur?.telephone || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profile.utilisateur?.date_naissance
                        ? new Date(profile.utilisateur.date_naissance).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gender</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profile.utilisateur?.sexe || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ID/CIN</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profile.utilisateur?.cin || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-lg font-medium text-gray-900">
                    {profile.utilisateur?.adresse || "-"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
