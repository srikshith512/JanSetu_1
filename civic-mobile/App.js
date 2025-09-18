import React, { useState } from 'react'
import { ScrollView, View, Text, TextInput, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { submitIssue } from './src/api'

export default function App() {
  const [category, setCategory] = useState('Roads')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [reportedBy, setReportedBy] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [location, setLocation] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)

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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topbar}><Text style={styles.topbarTitle}>JanSetu</Text></View>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.h1}>Report a New Civic Issue</Text>

          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>Issue Details</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Category</Text>
                <TextInput value={category} onChangeText={setCategory} placeholder="e.g., Roads" style={styles.input} />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Priority</Text>
                <TextInput value={priority} onChangeText={setPriority} placeholder="low | medium | high" style={styles.input} />
              </View>
            </View>
            <View style={styles.full}>
              <Text style={styles.label}>Description</Text>
              <TextInput value={description} onChangeText={setDescription} placeholder="Describe the issue" multiline numberOfLines={4} style={[styles.input, { height: 100 }]} />
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
            <TextInput value={contactInfo} onChangeText={setContactInfo} placeholder='{"phone":"...","email":"..."}' style={[styles.input, { height: 70 }]} multiline />
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
              editable={!locationLoading}
            />
          </View>

          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} disabled={submitting} onPress={onSubmit}>
            <Text style={styles.btnPrimaryText}>{submitting ? 'Submitting…' : 'Submit Issue'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = {
  safe: { flex: 1, backgroundColor: '#f1f5f9' },
  topbar: { backgroundColor: '#0b65e0', paddingVertical: 12, paddingHorizontal: 16 },
  topbarTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  container: { padding: 16, gap: 12 },
  h1: { fontSize: 22, fontWeight: '800', marginBottom: 6, color: '#0f172a' },
  panel: { backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 12, padding: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#0f172a' },
  row: { flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  full: { marginTop: 8 },
  label: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, backgroundColor: '#fff' },
  uploader: { flex: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfd' },
  uploaderHint: { color: '#64748b', fontWeight: '600' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  thumb: { width: 100, height: 80, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
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
}
