import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, TextInput, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
import { submitIssue, listIssues } from './src/api'

const TABS = { HOME: 'home', REPORT: 'report', MAP: 'map', NOTIFS: 'notifs', PROFILE: 'profile' }

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.HOME)
  const [category, setCategory] = useState('Roads')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [reportedBy, setReportedBy] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [location, setLocation] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [recent, setRecent] = useState([])
  const [loadingRecent, setLoadingRecent] = useState(false)

  async function pickImages() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return Alert.alert('Permission required', 'Allow photo library access to upload images')
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: 5,
    })
    if (!result.canceled) setImages(result.assets || [])
  }

  async function getCurrentLocation() {
    try {
      setLocationLoading(true)
      const { status } = await Location.requestForegroundPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to get your current location')
        return
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      })
      
      const { latitude, longitude } = location.coords
      setLocation(JSON.stringify({ lat: latitude, lng: longitude }))
      
    } catch (error) {
      console.error('Error getting location:', error)
      Alert.alert('Error', 'Could not get your current location. Please try again or enter manually.')
    } finally {
      setLocationLoading(false)
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') return Alert.alert('Permission required', 'Allow camera access to take a photo')
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 })
    if (!result.canceled && result.assets?.length) setImages((arr) => [...arr, result.assets[0]])
  }

  async function onSubmit() {
    try {
      if (!category || !description) return Alert.alert('Missing info', 'Please fill category and description')
      setSubmitting(true)
      const payload = {
        category,
        description,
        priority,
        reportedBy: reportedBy || undefined,
        contactInfo: contactInfo ? JSON.parse(contactInfo) : undefined,
        location: location ? JSON.parse(location) : undefined,
      }
      await submitIssue(payload, images)
      Alert.alert('Success', 'Issue submitted!')
      setDescription('')
      setImages([])
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Screen components moved out of render to avoid remounts causing TextInput blur
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoadingRecent(true)
        const { data } = await listIssues({ page: 1, limit: 3 })
        if (mounted) setRecent(data || [])
      } catch (e) {
        // ignore for home screen
      } finally {
        if (mounted) setLoadingRecent(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        {activeTab === TABS.HOME && (
          <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="none" contentContainerStyle={[styles.container, { paddingBottom: 96 }]}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#0f172a' }}>JanSetu</Text>
              <Text style={{ color: '#64748b', marginTop: 4 }}>Welcome back</Text>
            </View>

            <View style={{ marginTop: 8, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 10 }}>Quick Actions</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.actionPrimary} onPress={() => setActiveTab(TABS.REPORT)}>
                  <MaterialIcons name="add" size={24} color="#fff" />
                  <Text style={styles.actionPrimaryText}>Report Issue</Text>
                </TouchableOpacity>
                <View style={styles.actionCard}>
                  <MaterialIcons name="map" size={22} color="#2563eb" />
                  <Text style={styles.actionCardText}>View Map</Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 10 }}>Your Issues</Text>
              <View style={styles.row}>
                <View style={styles.statPill}><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>Pending</Text></View>
                <View style={styles.statPill}><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>In Progress</Text></View>
                <View style={styles.statPill}><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>Resolved</Text></View>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 10 }}>Recent Reports</Text>
              {loadingRecent ? (
                <View style={styles.emptyCard}><ActivityIndicator color="#2563eb" /></View>
              ) : recent?.length ? (
                recent.map((it) => (
                  <View key={it.id} style={[styles.panel, { marginBottom: 8 }]}> 
                    <Text style={{ fontWeight: '700', color: '#0f172a' }}>{it.category} · {it.priority}</Text>
                    <Text style={{ color: '#64748b', marginTop: 4 }} numberOfLines={2}>{it.description}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <MaterialIcons name="add" size={28} color="#94a3b8" />
                  <Text style={{ color: '#94a3b8', fontWeight: '700', marginTop: 6 }}>No issues reported yet</Text>
                  <Text style={{ color: '#94a3b8', marginTop: 2 }}>Tap "Report Issue" to get started</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
        {activeTab === TABS.REPORT && (
          <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="none" contentContainerStyle={[styles.container, { paddingBottom: 96 }]}>
            <Text style={styles.h1}>Report a New Civic Issue</Text>

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Issue Details</Text>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Category</Text>
                  <TextInput value={category} onChangeText={setCategory} placeholder="e.g., Roads" style={styles.input} blurOnSubmit={false} />
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Priority</Text>
                  <TextInput value={priority} onChangeText={setPriority} placeholder="low | medium | high" style={styles.input} blurOnSubmit={false} />
                </View>
              </View>
              <View style={styles.full}>
                <Text style={styles.label}>Description</Text>
                <TextInput value={description} onChangeText={setDescription} placeholder="Describe the issue" multiline numberOfLines={4} style={[styles.input, { height: 100 }]} blurOnSubmit={false} />
              </View>
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Attach Media</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.uploader} onPress={pickImages}><Text style={styles.uploaderHint}>Pick from Gallery</Text></TouchableOpacity>
                <TouchableOpacity style={styles.uploader} onPress={takePhoto}><Text style={styles.uploaderHint}>Open Camera</Text></TouchableOpacity>
              </View>
              <View style={styles.gallery}>
                {images.map((img) => (
                  <Image key={img.assetId || img.uri} source={{ uri: img.uri }} style={styles.thumb} />
                ))}
              </View>
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Location & Contact</Text>
              <Text style={styles.label}>Contact Info (JSON)</Text>
              <TextInput value={contactInfo} onChangeText={setContactInfo} placeholder='{"phone":"...","email":"..."}' style={[styles.input, { height: 70 }]} multiline blurOnSubmit={false} />
              <View style={styles.locationContainer}>
                <Text style={[styles.label, { marginTop: 10 }]}>Location (JSON)</Text>
                <TouchableOpacity 
                  style={styles.locationButton} 
                  onPress={getCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.locationButtonText}>Use Current Location</Text>
                  )}
                </TouchableOpacity>
              </View>
              <TextInput 
                value={location} 
                onChangeText={setLocation} 
                placeholder='{"lat":12.9,"lng":77.6}' 
                style={[styles.input, { height: 70, marginTop: 8 }]} 
                multiline 
                blurOnSubmit={false}
                editable={!locationLoading}
              />
            </View>

            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} disabled={submitting} onPress={onSubmit}>
              <Text style={styles.btnPrimaryText}>{submitting ? 'Submitting…' : 'Submit Issue'}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        {activeTab === TABS.MAP && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
            <Text style={{ color: '#64748b' }}>Map coming soon</Text>
          </View>
        )}
        {activeTab === TABS.NOTIFS && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
            <Text style={{ color: '#64748b' }}>Notifications coming soon</Text>
          </View>
        )}
        {activeTab === TABS.PROFILE && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
            <Text style={{ color: '#64748b' }}>Profile coming soon</Text>
          </View>
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab(TABS.REPORT)}>
            <MaterialIcons name="add-circle-outline" size={24} color={activeTab === TABS.REPORT ? '#2563eb' : '#94a3b8'} />
            <Text style={[styles.navText, { color: activeTab === TABS.REPORT ? '#2563eb' : '#94a3b8' }]}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab(TABS.MAP)}>
            <MaterialIcons name="map" size={24} color={activeTab === TABS.MAP ? '#2563eb' : '#94a3b8'} />
            <Text style={[styles.navText, { color: activeTab === TABS.MAP ? '#2563eb' : '#94a3b8' }]}>Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab(TABS.NOTIFS)}>
            <MaterialIcons name="notifications-none" size={24} color={activeTab === TABS.NOTIFS ? '#2563eb' : '#94a3b8'} />
            <Text style={[styles.navText, { color: activeTab === TABS.NOTIFS ? '#2563eb' : '#94a3b8' }]}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab(TABS.PROFILE)}>
            <MaterialIcons name="person-outline" size={24} color={activeTab === TABS.PROFILE ? '#2563eb' : '#94a3b8'} />
            <Text style={[styles.navText, { color: activeTab === TABS.PROFILE ? '#2563eb' : '#94a3b8' }]}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab(TABS.HOME)}>
            <MaterialIcons name="home" size={24} color={activeTab === TABS.HOME ? '#2563eb' : '#94a3b8'} />
            <Text style={[styles.navText, { color: activeTab === TABS.HOME ? '#2563eb' : '#94a3b8' }]}>Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = {
  safe: { flex: 1, backgroundColor: '#f1f5f9' },
  topbar: { backgroundColor: '#0b65e0', paddingVertical: 12, paddingHorizontal: 16 },
  topbarTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  container: { padding: 16 },
  h1: { fontSize: 22, fontWeight: '800', marginBottom: 6, color: '#0f172a' },
  panel: { backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#0f172a' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  col: { width: '48%' },
  full: { marginTop: 8 },
  label: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, backgroundColor: '#fff' },
  uploader: { width: '48%', borderStyle: 'dashed', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfd' },
  uploaderHint: { color: '#64748b', fontWeight: '600' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  thumb: { width: 100, height: 80, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', marginRight: 8, marginBottom: 8 },
  btn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnPrimary: { backgroundColor: '#2563eb' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  locationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationButton: { 
    backgroundColor: '#3b82f6', 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 6, 
    marginTop: 10,
    marginLeft: 10
  },
  locationButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  // Home quick actions
  actionPrimary: { width: '48%', height: 90, backgroundColor: '#2563eb', borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center' },
  actionPrimaryText: { color: '#fff', fontWeight: '700', marginTop: 6 },
  actionCard: { width: '48%', height: 90, backgroundColor: '#fff', borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  actionCardText: { color: '#0f172a', fontWeight: '700', marginTop: 6 },
  // Stats
  statPill: { width: '32%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  statNumber: { color: '#2563eb', fontWeight: '800', fontSize: 16 },
  statLabel: { color: '#64748b', marginTop: 2, fontSize: 12 },
  // Empty card
  emptyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingVertical: 28, alignItems: 'center', justifyContent: 'center' },
  // Bottom navigation
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 6, paddingBottom: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 12, marginTop: 2, color: '#94a3b8' },
}
