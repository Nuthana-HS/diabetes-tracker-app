'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRScanner({ onScanSuccess, onScanFailure }) {
    const [error, setError] = useState('');
    const scannerRef = useRef(null);

    useEffect(() => {
        // Prevent multiple instances in React 18 strict mode
        if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        /* verbose= */ false
            );
            scannerRef.current.render(
                (decodedText) => {
                    if (scannerRef.current) {
                        scannerRef.current.clear().catch(e => console.error(e));
                    }
                    if (onScanSuccess) onScanSuccess(decodedText);
                },
                (errorMessage) => {
                    if (onScanFailure) onScanFailure(errorMessage);
                }
            );
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error("Failed to clear html5QrcodeScanner. ", e));
                scannerRef.current = null;
            }
        };
    }, [onScanSuccess, onScanFailure]);

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', padding: '10px', borderRadius: '16px', overflow: 'hidden' }}>
            <div id="qr-reader" style={{ width: '100%', border: 'none' }}></div>
            {error && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}
