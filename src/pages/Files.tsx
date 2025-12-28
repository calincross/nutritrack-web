import React, { useState, useEffect } from 'react';
import { Upload, Trash2, FileText, Download } from 'lucide-react';
import { documentsAPI } from '@/services/api';
import type { Document } from '@/types';
import { format } from 'date-fns';

export function Files() {
  const [dietPlans, setDietPlans] = useState<Document[]>([]);
  const [consultations, setConsultations] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<'diet-plan' | 'consultation' | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const dietResponse = await documentsAPI.getByType('diet-plan');
      const consultResponse = await documentsAPI.getByType('consultation');
      setDietPlans(dietResponse.data);
      setConsultations(consultResponse.data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'diet-plan' | 'consultation') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    try {
      setUploadingType(type);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      await documentsAPI.upload(formData);
      await loadDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file');
    } finally {
      setUploadingType(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await documentsAPI.delete(id);
        await loadDocuments();
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <div className="card flex items-start justify-between">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-3 bg-red-50 rounded-lg">
          <FileText className="text-red-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {(doc.size / 1024 / 1024).toFixed(2)} MB • {format(new Date(doc.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <a
          href={doc.url}
          download
          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
          title="Download"
        >
          <Download size={18} />
        </a>
        <button
          onClick={() => handleDelete(doc.id)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600 mt-1">Upload and manage your diet plans and doctor consultations</p>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-12">Loading documents...</p>
      ) : (
        <>
          {/* Diet Plans Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Diet Plans</h2>
              <label className="btn-primary cursor-pointer flex items-center gap-2">
                <Upload size={18} />
                {uploadingType === 'diet-plan' ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'diet-plan')}
                  disabled={uploadingType !== null}
                  className="hidden"
                />
              </label>
            </div>

            {dietPlans.length === 0 ? (
              <div className="card text-center py-12">
                <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">No diet plans uploaded yet</p>
                <p className="text-gray-400 text-sm mt-1">Upload your diet plans to keep them organized</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dietPlans.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            )}
          </div>

          {/* Doctor Consultations Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Doctor Consultations</h2>
              <label className="btn-secondary cursor-pointer flex items-center gap-2">
                <Upload size={18} />
                {uploadingType === 'consultation' ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'consultation')}
                  disabled={uploadingType !== null}
                  className="hidden"
                />
              </label>
            </div>

            {consultations.length === 0 ? (
              <div className="card text-center py-12">
                <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">No consultations uploaded yet</p>
                <p className="text-gray-400 text-sm mt-1">Upload your doctor consultations for reference</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
