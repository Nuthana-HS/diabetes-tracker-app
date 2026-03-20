'use client';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Droplets, Pill, Calendar } from 'lucide-react';
import { getHbA1cHistory } from '@/services/hba1c';
import { getMedications } from '@/services/medications';

export default function SharePage() {
  const params = useParams();
  const [patientData, setPatientData] = useState(null);
  const [readings, setReadings] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // In a real app, you'd fetch patient data using params.id
        // For now, we'll show mock data
        setPatientData({
          id: params.id,
          name: 'Patient Name',
          latestHbA1c: 7.2,
          targetHbA1c: 7.0
        });

        // Mock readings
        setReadings([
          { date: '2026-03-16', value: 7.2 },
          { date: '2026-03-09', value: 7.5 },
          { date: '2026-03-02', value: 7.8 }
        ]);

        // Mock medications
        setMedications([
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
        ]);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              Patient Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Shared by patient ID: {params.id}
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* HbA1c Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                HbA1c History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {readings.map((reading, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{new Date(reading.date).toLocaleDateString()}</span>
                    <span className={`font-bold ${
                      reading.value < 7 ? 'text-green-600' :
                      reading.value < 8 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {reading.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 text-purple-600 mr-2" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medications.map((med, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded">
                    <p className="font-semibold">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.dosage} · {med.frequency}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Doctor's Note Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Doctor's Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full p-3 border rounded-lg"
              rows="4"
              placeholder="Add your clinical notes here..."
            />
            <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
              Save Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}