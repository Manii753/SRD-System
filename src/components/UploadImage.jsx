'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function UploadImage({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const inputRef = useRef(null);

  function handleFiles(selected) {
    const f = selected[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length) {
      handleFiles(dt.files);
    }
  }

  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  async function upload() {
    if (!file || !preview) return;
    setUploading(true);
    setProgress(0);

    // Use XHR so we get upload progress events
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/uploads');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const p = Math.round((e.loaded / e.total) * 100);
        setProgress(p);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      try {
        const res = JSON.parse(xhr.responseText);
        if (res && res.success && res.url) {
          setUploadedUrl(res.url);
          if (onUploaded) onUploaded(res.url);
        }
      } catch (err) {
        console.error('Upload response parse error', err);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      console.error('Upload failed');
    };

    // send file as data URL inside JSON so server can decode easily
    // preview is a data URL
    const payload = JSON.stringify({ fileName: file.name, fileData: preview });

    // Slight visual delay so progress shows before immediate send
    setTimeout(() => xhr.send(payload), 50);
  }

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!preview && (
          <div>
            <p className="text-gray-600">Drag & drop an image here, or click to select a file</p>
            <div className="mt-3">
              <Button type="button" variant="outline" onClick={() => inputRef.current && inputRef.current.click()}>
                Choose Image
              </Button>
            </div>
          </div>
        )}

        {preview && (
          <div className="space-y-3">
            <img src={preview} alt="preview" className="mx-auto max-h-56 object-contain rounded" />

            <div className="flex items-center justify-center space-x-3">
              <Button type="button" onClick={() => upload()} disabled={uploading || !!uploadedUrl}>
                {uploading ? 'Uploading...' : uploadedUrl ? 'Uploaded' : 'Upload'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setFile(null); setPreview(null); setProgress(0); setUploadedUrl(null); if (onUploaded) onUploaded(null); }}>
                Remove
              </Button>
            </div>

            <div>
              <Progress value={progress} className="h-2" />
              <div className="text-sm text-gray-600 mt-1 text-center">{progress}%</div>
            </div>
          </div>
        )}

        {uploadedUrl && (
          <div className="mt-3 text-center text-sm text-green-700">Uploaded: <a href={uploadedUrl} target="_blank" rel="noreferrer" className="underline">{uploadedUrl}</a></div>
        )}
      </div>
    </div>
  );
}
