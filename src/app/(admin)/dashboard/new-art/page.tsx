'use client';

import { CldUploadButton } from 'next-cloudinary';
import { useState } from 'react';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState<CloudinaryUploadWidgetInfo | null>(null);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Upload an Image</h1>

      <div style={{
        backgroundColor: '#0070f3',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'inline-block'
      }}>
        <CldUploadButton
          uploadPreset="blog_page_artworks"
          onSuccess={(result) => {
            if (result.info && typeof result.info !== 'string') {
              setUploadedImage(result.info);
              console.log('Upload successful:', result.info);
            }
          }}
          onQueuesEnd={(result, { widget }) => {
            widget.close();
          }}
        >
          Upload Image
        </CldUploadButton>
      </div>

      {uploadedImage && (
        <div style={{ marginTop: '2rem' }}>
          <p>Upload successful!</p>
          <p><strong>Public ID:</strong> {uploadedImage.public_id}</p>
        </div>
      )}
    </main>
  );
}