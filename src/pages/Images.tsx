import { useState } from 'react'
import { Upload, Trash2, ZoomIn } from 'lucide-react'

interface ImageItem {
  id: string
  name: string
  src: string
  uploaded: string
  size: string
}

export default function Images() {
  const [images, setImages] = useState<ImageItem[]>([
    { id: '1', name: 'STL Cabinetry Logo', src: 'https://via.placeholder.com/300x200?text=STL+Cabinetry', uploaded: '2026-04-05', size: '245 KB' },
    { id: '2', name: 'Cabinet Design Spec', src: 'https://via.placeholder.com/300x200?text=Cabinet+Spec', uploaded: '2026-04-06', size: '1.2 MB' },
  ])
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState('')

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setImages([...images, {
            id: Date.now().toString(),
            name: file.name,
            src: event.target?.result as string,
            uploaded: new Date().toISOString().split('T')[0],
            size: `${(file.size / 1024).toFixed(1)} KB`,
          }])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const deleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id))
    if (selectedImage?.id === id) setSelectedImage(null)
  }

  const analyzeImage = async () => {
    if (!selectedImage) return
    setAnalyzing(true)
    
    // Simulate analysis
    setTimeout(() => {
      setAnalysis(`Image Analysis for "${selectedImage.name}":\n\n- Dimensions: 1024x768\n- Format: JPEG\n- Quality: High\n- Colors: RGB\n- File Size: ${selectedImage.size}\n\nContent detected: Cabinet design, shelving units, hardware specifications visible.`)
      setAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-400">Image Gallery</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400 cursor-pointer">
          <Upload size={20} /> Upload
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gallery */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(img => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage?.id === img.id ? 'border-cyan-500' : 'border-gray-700 hover:border-cyan-500/50'
              }`}
            >
              <img src={img.src} alt={img.name} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <ZoomIn size={20} className="text-cyan-400" />
                <Trash2 size={20} className="text-red-400 cursor-pointer" onClick={(e) => { e.stopPropagation(); deleteImage(img.id) }} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                <p className="text-xs text-gray-300 truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Details Panel */}
        {selectedImage && (
          <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/40 space-y-4">
            <div>
              <img src={selectedImage.src} alt={selectedImage.name} className="w-full rounded-lg mb-4" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Filename</p>
              <p className="font-semibold text-white">{selectedImage.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Uploaded</p>
                <p className="text-white">{selectedImage.uploaded}</p>
              </div>
              <div>
                <p className="text-gray-500">Size</p>
                <p className="text-white">{selectedImage.size}</p>
              </div>
            </div>

            {/* Analysis */}
            {analysis && (
              <div className="border border-cyan-500/20 rounded p-3 bg-cyan-500/5 space-y-2">
                <p className="text-sm font-semibold text-cyan-400">Analysis</p>
                <p className="text-xs text-gray-300 whitespace-pre-wrap">{analysis}</p>
              </div>
            )}

            <button
              onClick={analyzeImage}
              disabled={analyzing}
              className="w-full py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400 font-semibold disabled:opacity-50"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>

            <button
              onClick={() => deleteImage(selectedImage.id)}
              className="w-full py-2 bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/30 text-red-400 font-semibold"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
