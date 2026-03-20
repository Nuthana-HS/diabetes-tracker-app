'use client';

import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X, Check, RefreshCw, Loader2, Upload } from 'lucide-react';

export default function CameraComponent({ onCapture, onClose }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setImage(imageSrc);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const confirmImage = async () => {
    setProcessing(true);
    try {
      await onCapture(image);
    } finally {
      setProcessing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl dark:bg-gray-800">

        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold dark:text-white">Scan Lab Report</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Take a photo or upload an image
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <CardContent className="p-4 space-y-4">
          {!image ? (
            <>
              {/* Camera View */}
              {!cameraError ? (
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.9}
                    className="w-full h-full object-cover"
                    onUserMediaError={() => setCameraError(true)}
                    videoConstraints={{ facingMode: 'environment' }}
                  />
                </div>
              ) : (
                /* Camera not available */
                <div className="rounded-xl bg-gray-100 dark:bg-gray-700 aspect-video flex flex-col items-center justify-center gap-3">
                  <Camera className="h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Camera not available
                  </p>
                  <p className="text-xs text-gray-400">
                    Use file upload below instead
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                {!cameraError && (
                  <Button
                    onClick={capture}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Take Photo
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${cameraError ? 'flex-1' : ''}`}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </>
          ) : (
            <>
              {/* Image Preview */}
              <div className="rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt="captured"
                  className="w-full object-cover max-h-72"
                />
              </div>

              {/* Confirm / Retake */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setImage(null)}
                  className="flex-1"
                  disabled={processing}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake
                </Button>
                <Button
                  onClick={confirmImage}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={processing}
                >
                  {processing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <><Check className="mr-2 h-4 w-4" /> Use This Photo</>
                  )}
                </Button>
              </div>
            </>
          )}

          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            Position the HbA1c value clearly in frame for best results
          </p>
        </CardContent>
      </Card>
    </div>
  );
}