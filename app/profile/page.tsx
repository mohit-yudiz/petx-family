'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Camera, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area is required'),
  bio: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

const ownerProfileSchema = z.object({
  travelFrequency: z.string().optional(),
  preferredHostType: z.string().optional(),
  vetName: z.string().optional(),
  vetContact: z.string().optional(),
});

const hostProfileSchema = z.object({
  hasOwnPets: z.boolean(),
  numOfPets: z.number().optional(),
  typesOfPets: z.string().optional(),
  petExperienceYears: z.number().optional(),
  homeType: z.string().optional(),
  hasOpenSpace: z.boolean(),
  hasChildren: z.boolean(),
  maxPetsCanHost: z.number().min(1, 'Must be at least 1'),
  providesDailyUpdates: z.boolean(),
});

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { profile, updateProfile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isOwner, setIsOwner] = useState(profile?.is_owner || false);
  const [isHost, setIsHost] = useState(profile?.is_host || false);
  const [languages, setLanguages] = useState<string[]>(profile?.languages_spoken || []);
  const [newLanguage, setNewLanguage] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch: watchGeneral } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      city: '',
      area: '',
      bio: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  });

  const { register: registerOwner, handleSubmit: handleOwnerSubmit, formState: { errors: ownerErrors }, setValue: setOwnerValue, reset: resetOwner, watch: watchOwner } = useForm({
    resolver: zodResolver(ownerProfileSchema),
    defaultValues: {
      travelFrequency: '',
      preferredHostType: '',
      vetName: '',
      vetContact: '',
    },
  });

  const { register: registerHost, handleSubmit: handleHostSubmit, formState: { errors: hostErrors }, setValue: setHostValue, watch, reset: resetHost } = useForm({
    resolver: zodResolver(hostProfileSchema),
    defaultValues: {
      hasOwnPets: false,
      numOfPets: 0,
      typesOfPets: '',
      petExperienceYears: 0,
      homeType: '',
      hasOpenSpace: false,
      hasChildren: false,
      maxPetsCanHost: 1,
      providesDailyUpdates: true,
    },
  });

  const hasOwnPets = watch('hasOwnPets');

  useEffect(() => {
    setIsOwner(profile?.is_owner || false);
    setIsHost(profile?.is_host || false);
    setLanguages(profile?.languages_spoken || []);

    // Reset form values when profile data is available
    if (profile) {
      reset({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dob || '',
        gender: profile.gender || '',
        city: profile.city || '',
        area: profile.area || '',
        bio: profile.bio || '',
        emergencyContactName: profile.emergency_contact_name || '',
        emergencyContactPhone: profile.emergency_contact_phone || '',
      });

      resetOwner({
        travelFrequency: profile.travel_frequency || '',
        preferredHostType: profile.preferred_host_type || '',
        vetName: profile.vet_name || '',
        vetContact: profile.vet_contact || '',
      });

      resetHost({
        hasOwnPets: profile.has_own_pets || false,
        numOfPets: profile.num_of_pets || 0,
        typesOfPets: profile.types_of_pets?.join(', ') || '',
        petExperienceYears: profile.pet_experience_years || 0,
        homeType: profile.home_type || '',
        hasOpenSpace: profile.has_open_space || false,
        hasChildren: profile.has_children || false,
        maxPetsCanHost: profile.max_pets_can_host || 1,
        providesDailyUpdates: profile.provides_daily_updates || true,
      });
    }
  }, [profile, reset, resetOwner, resetHost]);

  const handleRoleToggle = async (role: 'owner' | 'host', value: boolean) => {
    setIsLoading(true);
    try {
      let activeRole = profile?.active_role;
      const newIsOwner = role === 'owner' ? value : isOwner;
      const newIsHost = role === 'host' ? value : isHost;

      if (newIsOwner && newIsHost) {
        activeRole = 'both';
      } else if (newIsOwner) {
        activeRole = 'owner';
      } else if (newIsHost) {
        activeRole = 'host';
      }

      const { error } = await updateProfile({
        is_owner: newIsOwner,
        is_host: newIsHost,
        active_role: activeRole,
      });

      if (error) {
        toast.error('Failed to update role');
      } else {
        if (role === 'owner') setIsOwner(value);
        if (role === 'host') setIsHost(value);
        toast.success('Role updated successfully');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitGeneral = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        dob: data.dateOfBirth,
        gender: data.gender,
        city: data.city,
        area: data.area,
        bio: data.bio,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_phone: data.emergencyContactPhone,
        languages_spoken: languages,
      });

      if (error) {
        toast.error('Failed to update profile');
      } else {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOwner = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await updateProfile({
        travel_frequency: data.travelFrequency,
        preferred_host_type: data.preferredHostType,
        vet_name: data.vetName,
        vet_contact: data.vetContact,
      });

      if (error) {
        toast.error('Failed to update owner profile');
      } else {
        toast.success('Owner profile updated successfully');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitHost = async (data: any) => {
    setIsLoading(true);
    try {
      const typesArray = data.typesOfPets ? data.typesOfPets.split(',').map((t: string) => t.trim()) : [];

      const { error } = await updateProfile({
        has_own_pets: data.hasOwnPets,
        num_of_pets: data.numOfPets,
        types_of_pets: typesArray,
        pet_experience_years: data.petExperienceYears,
        home_type: data.homeType,
        has_open_space: data.hasOpenSpace,
        has_children: data.hasChildren,
        max_pets_can_host: data.maxPetsCanHost,
        provides_daily_updates: data.providesDailyUpdates,
      });

      if (error) {
        toast.error('Failed to update host profile');
      } else {
        toast.success('Host profile updated successfully');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const addLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Upload a clear photo of yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.profile_photo || ''} />
                <AvatarFallback className="text-2xl">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Roles</CardTitle>
            <CardDescription>Choose how you want to use PetXfamily</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Pet Owner</p>
                <p className="text-sm text-gray-500">Find hosts for your pets</p>
              </div>
              <Switch
                checked={isOwner}
                onCheckedChange={(checked) => handleRoleToggle('owner', checked)}
                disabled={isLoading || (!isOwner && !isHost)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Pet Host</p>
                <p className="text-sm text-gray-500">Host pets in your home</p>
              </div>
              <Switch
                checked={isHost}
                onCheckedChange={(checked) => handleRoleToggle('host', checked)}
                disabled={isLoading || (!isHost && !isOwner)}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="owner" disabled={!isOwner}>Owner Details</TabsTrigger>
            <TabsTrigger value="host" disabled={!isHost}>Host Details</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Your basic profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitGeneral)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...register('firstName')} />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...register('lastName')} />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" {...register('phone')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={watchGeneral('gender') || ''} 
                      onValueChange={(value) => setValue('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" {...register('city')} />
                      {errors.city && (
                        <p className="text-sm text-red-500">{errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area / Locality *</Label>
                      <Input id="area" {...register('area')} />
                      {errors.area && (
                        <p className="text-sm text-red-500">{errors.area.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Short Bio</Label>
                    <Textarea
                      id="bio"
                      {...register('bio')}
                      placeholder="Tell us about yourself and your love for pets..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Languages Spoken</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="e.g., English"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addLanguage();
                          }
                        }}
                      />
                      <Button type="button" onClick={addLanguage}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {languages.map((lang) => (
                        <Badge key={lang} variant="secondary">
                          {lang}
                          <button
                            type="button"
                            onClick={() => removeLanguage(lang)}
                            className="ml-2 text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                      <Input id="emergencyContactName" {...register('emergencyContactName')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                      <Input id="emergencyContactPhone" {...register('emergencyContactPhone')} />
                    </div>
                  </div>

                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="owner">
            <Card>
              <CardHeader>
                <CardTitle>Pet Owner Details</CardTitle>
                <CardDescription>Information for when you&apos;re looking for pet hosts</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOwnerSubmit(onSubmitOwner)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelFrequency">Travel Frequency</Label>
                    <Select 
                      value={watchOwner('travelFrequency') || ''} 
                      onValueChange={(value) => setOwnerValue('travelFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How often do you travel?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rarely">Rarely (1-2 times/year)</SelectItem>
                        <SelectItem value="occasionally">Occasionally (3-5 times/year)</SelectItem>
                        <SelectItem value="frequently">Frequently (6+ times/year)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredHostType">Preferred Host Type</Label>
                    <Input
                      id="preferredHostType"
                      {...registerOwner('preferredHostType')}
                      placeholder="e.g., Experienced with large dogs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vetName">Veterinarian Name</Label>
                      <Input id="vetName" {...registerOwner('vetName')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vetContact">Veterinarian Contact</Label>
                      <Input id="vetContact" {...registerOwner('vetContact')} />
                    </div>
                  </div>

                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="host">
            <Card>
              <CardHeader>
                <CardTitle>Pet Host Details</CardTitle>
                <CardDescription>Information for pet owners to know about your hosting</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHostSubmit(onSubmitHost)} className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="hasOwnPets">I have my own pets</Label>
                    <Switch
                      id="hasOwnPets"
                      checked={hasOwnPets}
                      onCheckedChange={(checked) => setHostValue('hasOwnPets', checked)}
                    />
                  </div>

                  {hasOwnPets && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="numOfPets">Number of Pets</Label>
                          <Input
                            id="numOfPets"
                            type="number"
                            {...registerHost('numOfPets', { valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="typesOfPets">Types of Pets</Label>
                          <Input
                            id="typesOfPets"
                            {...registerHost('typesOfPets')}
                            placeholder="e.g., Dog, Cat"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="petExperienceYears">Years of Experience with Pets</Label>
                    <Input
                      id="petExperienceYears"
                      type="number"
                      {...registerHost('petExperienceYears', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homeType">Home Type</Label>
                    <Select 
                      value={watch('homeType') || ''} 
                      onValueChange={(value) => setHostValue('homeType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your home type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="hasOpenSpace">I have open space/yard</Label>
                    <Switch
                      id="hasOpenSpace"
                      checked={watch('hasOpenSpace')}
                      onCheckedChange={(checked) => setHostValue('hasOpenSpace', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="hasChildren">I have children at home</Label>
                    <Switch
                      id="hasChildren"
                      checked={watch('hasChildren')}
                      onCheckedChange={(checked) => setHostValue('hasChildren', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPetsCanHost">Maximum Pets I Can Host</Label>
                    <Input
                      id="maxPetsCanHost"
                      type="number"
                      min="1"
                      {...registerHost('maxPetsCanHost', { valueAsNumber: true })}
                    />
                    {hostErrors.maxPetsCanHost && (
                      <p className="text-sm text-red-500">{hostErrors.maxPetsCanHost.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="providesDailyUpdates">I will provide daily updates</Label>
                    <Switch
                      id="providesDailyUpdates"
                      checked={watch('providesDailyUpdates')}
                      onCheckedChange={(checked) => {
                        // @ts-ignore
                        setHostValue('providesDailyUpdates', checked);
                      }}
                    />
                  </div>

                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
