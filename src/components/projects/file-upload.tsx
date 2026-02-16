'use client';

import { useState, useCallback } from 'react';
import { Upload, X, File, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUploadAsset } from '@/hooks/use-projects';

interface FileWithPreview extends File {
    preview?: string;
}

interface UploadedFile {
    file: File;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress: number;
    assetId?: string;
    error?: string;
}

interface FileUploadProps {
    projectId: string;
    onUploadComplete?: (assetIds: string[]) => void;
    maxFiles?: number;
    accept?: Record<string, string[]>;
}

export function FileUpload({
    projectId,
    onUploadComplete,
    maxFiles = 50,
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        'video/*': ['.mp4', '.webm'],
        'audio/*': ['.mp3', '.wav'],
    },
}: FileUploadProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const uploadAsset = useUploadAsset();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
            file,
            status: 'pending',
            progress: 0,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        multiple: true,
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadAllFiles = async () => {
        const pendingFiles = files.filter((f) => f.status === 'pending');
        const uploadedAssetIds: string[] = [];

        for (let i = 0; i < files.length; i++) {
            if (files[i].status !== 'pending') continue;

            // Update status to uploading
            setFiles((prev) =>
                prev.map((f, idx) =>
                    idx === i ? { ...f, status: 'uploading' as const, progress: 0 } : f
                )
            );

            try {
                const result = await uploadAsset.mutateAsync({
                    projectId,
                    file: files[i].file,
                });

                uploadedAssetIds.push(result.asset_id);

                // Update to success
                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? { ...f, status: 'success' as const, progress: 100, assetId: result.asset_id }
                            : f
                    )
                );
            } catch (error: any) {
                // Update to error
                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? { ...f, status: 'error' as const, error: error.message || 'Upload failed' }
                            : f
                    )
                );
            }
        }

        if (uploadedAssetIds.length > 0) {
            onUploadComplete?.(uploadedAssetIds);
        }
    };

    const clearCompleted = () => {
        setFiles((prev) => prev.filter((f) => f.status !== 'success'));
    };

    const retryFailed = () => {
        setFiles((prev) =>
            prev.map((f) => (f.status === 'error' ? { ...f, status: 'pending' as const } : f))
        );
    };

    const pendingCount = files.filter((f) => f.status === 'pending').length;
    const uploadingCount = files.filter((f) => f.status === 'uploading').length;
    const successCount = files.filter((f) => f.status === 'success').length;
    const errorCount = files.filter((f) => f.status === 'error').length;

    const isUploading = uploadingCount > 0;

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border-default hover:border-primary hover:bg-bg-tertiary'
                )}
            >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-text-tertiary" />
                {isDragActive ? (
                    <p className="text-lg font-medium text-primary">Drop files here...</p>
                ) : (
                    <>
                        <p className="text-lg font-medium text-text-primary mb-2">
                            Drag & drop files here, or click to select
                        </p>
                        <p className="text-sm text-text-tertiary">
                            Supports images, videos, and audio files (max {maxFiles} files)
                        </p>
                    </>
                )}
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-text-secondary">
                                {files.length} file{files.length > 1 ? 's' : ''}
                            </span>
                            {successCount > 0 && (
                                <span className="text-success">✓ {successCount} uploaded</span>
                            )}
                            {errorCount > 0 && <span className="text-error">✗ {errorCount} failed</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            {successCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                                    Clear Completed
                                </Button>
                            )}
                            {errorCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={retryFailed}>
                                    Retry Failed
                                </Button>
                            )}
                            {pendingCount > 0 && (
                                <Button onClick={uploadAllFiles} disabled={isUploading}>
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>Upload {pendingCount} file{pendingCount > 1 ? 's' : ''}</>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Files */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {files.map((uploadFile, index) => (
                            <FileItem
                                key={index}
                                uploadFile={uploadFile}
                                onRemove={() => removeFile(index)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function FileItem({
    uploadFile,
    onRemove,
}: {
    uploadFile: UploadedFile;
    onRemove: () => void;
}) {
    const { file, status, progress, error } = uploadFile;
    const isImage = file.type.startsWith('image/');

    return (
        <div className="flex items-center gap-3 p-3 bg-bg-secondary border border-border-subtle rounded-xl">
            {/* Icon/Preview */}
            <div className="w-12 h-12 bg-bg-tertiary rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {isImage ? (
                    <ImageIcon className="w-6 h-6 text-text-tertiary" />
                ) : (
                    <File className="w-6 h-6 text-text-tertiary" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-text-tertiary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {status === 'success' && <CheckCircle2 className="w-4 h-4 text-success" />}
                    {status === 'error' && (
                        <span className="text-xs text-error">{error || 'Failed'}</span>
                    )}
                </div>
                {status === 'uploading' && (
                    <div className="mt-2 h-1 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Status/Remove */}
            <div className="shrink-0">
                {status === 'uploading' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                    <button
                        onClick={onRemove}
                        className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-text-tertiary" />
                    </button>
                )}
            </div>
        </div>
    );
}