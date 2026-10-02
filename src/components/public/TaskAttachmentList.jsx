import { useState } from 'react'
import { FileText, Image as ImageIcon, Paperclip, X, Download } from 'lucide-react'
import { formatFileSize } from '../../lib/tasks'

/**
 * TaskAttachmentList
 * Renders attachment metadata from `tugas_foto`.
 * Never exposes raw storage_path or database IDs.
 */
export function TaskAttachmentList({ attachments, showTitle = true }) {
  const [selectedImage, setSelectedImage] = useState(null)

  if (!attachments || attachments.length === 0) {
    return (
      <div className="py-2 text-xs" style={{ color: 'var(--public-text-muted)' }}>
        Tidak ada lampiran.
      </div>
    )
  }

  // Resolve file extension or short mime type
  const getFileTypeLabel = (fileName, mimeType) => {
    if (fileName && fileName.includes('.')) {
      return fileName.split('.').pop().toUpperCase()
    }
    if (mimeType) {
      const parts = mimeType.split('/')
      return parts[1] ? parts[1].toUpperCase() : parts[0].toUpperCase()
    }
    return 'FILE'
  }

  const isImageAttachment = (mimeType, fileName) => {
    if (mimeType && mimeType.startsWith('image/')) return true
    if (fileName && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName)) return true
    return false
  }

  return (
    <div className="space-y-3">
      {showTitle && (
        <h4
          className="text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: 'var(--public-text-muted)' }}
        >
          Lampiran ({attachments.length})
        </h4>
      )}

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="list">
        {attachments.map((file, idx) => {
          const isImage = isImageAttachment(file.mime_type, file.file_name)
          const typeLabel = getFileTypeLabel(file.file_name, file.mime_type)
          const sizeText = formatFileSize(file.file_size)
          // Safe URL check: only if a verified public URL exists (e.g. from future bucket config or prop)
          const fileUrl = file.url || null

          return (
            <li
              key={file.id || idx}
              className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors duration-200"
              style={{
                backgroundColor: 'var(--public-bg-secondary)',
                borderColor: 'var(--public-border-subtle, var(--public-border))',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
                  style={{
                    backgroundColor: 'var(--public-surface)',
                    borderColor: 'var(--public-border)',
                    color: isImage ? 'var(--public-accent)' : 'var(--public-text-secondary)',
                  }}
                  aria-hidden="true"
                >
                  {isImage ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-xs font-medium"
                    style={{ color: 'var(--public-text-primary)' }}
                    title={file.file_name || 'Lampiran'}
                  >
                    {file.file_name || 'Lampiran Tugas'}
                  </p>
                  <p
                    className="mt-0.5 flex items-center gap-2 text-[11px]"
                    style={{ color: 'var(--public-text-muted)' }}
                  >
                    <span className="font-mono text-[10px] uppercase">{typeLabel}</span>
                    {sizeText && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{sizeText}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action: Open/Download if URL exists, or info tag */}
              {fileUrl ? (
                isImage ? (
                  <button
                    type="button"
                    onClick={() => setSelectedImage({ url: fileUrl, title: file.file_name })}
                    className="inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium transition-colors hover:opacity-80"
                    style={{
                      borderColor: 'var(--public-border)',
                      color: 'var(--public-accent)',
                      backgroundColor: 'var(--public-surface)',
                    }}
                  >
                    Lihat
                  </button>
                ) : (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.file_name}
                    className="inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-xs font-medium transition-colors hover:opacity-80"
                    style={{
                      borderColor: 'var(--public-border)',
                      color: 'var(--public-accent)',
                      backgroundColor: 'var(--public-surface)',
                    }}
                    aria-label={`Unduh ${file.file_name}`}
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Unduh</span>
                  </a>
                )
              ) : (
                <span
                  className="shrink-0 rounded px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase border"
                  style={{
                    color: 'var(--public-text-muted)',
                    borderColor: 'var(--public-border)',
                    backgroundColor: 'var(--public-surface)',
                  }}
                  title="Lampiran tersimpan dalam sistem"
                >
                  <Paperclip className="inline-block h-2.5 w-2.5 mr-1" aria-hidden="true" />
                  File
                </span>
              )}
            </li>
          )
        })}
      </ul>

      {/* Accessible Lightbox Modal if an image URL is opened */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau Gambar Lampiran"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedImage(null)
          }}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-lg border bg-black shadow-2xl"
            style={{ borderColor: 'var(--public-border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--public-border)' }}>
              <p className="truncate text-xs font-medium text-white">
                {selectedImage.title}
              </p>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="rounded-md p-1 text-slate-400 hover:text-white"
                aria-label="Tutup pratinjau"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-center p-2">
              <img
                src={selectedImage.url}
                alt={selectedImage.title || 'Pratinjau lampiran tugas'}
                className="max-h-[75vh] w-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
