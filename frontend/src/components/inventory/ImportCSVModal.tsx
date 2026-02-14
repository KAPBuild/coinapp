import { useState, useCallback, useRef } from 'react'
import { X, Upload, Loader, CheckCircle, AlertTriangle, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { parseCSVFile } from '../../lib/importUtils'
import { useImportCoins } from '../../hooks/useImportCoins'
import type { BatchCreateResponse } from '../../types/importTypes'

type Stage = 'idle' | 'parsing' | 'preview' | 'importing' | 'complete' | 'error'

interface Props {
  onClose: () => void
}

export function ImportCSVModal({ onClose }: Props) {
  const [stage, setStage] = useState<Stage>('idle')
  const [fileName, setFileName] = useState('')
  const [validRows, setValidRows] = useState<Record<string, any>[]>([])
  const [parseErrors, setParseErrors] = useState<{ row: number; error: string }[]>([])
  const [totalParsed, setTotalParsed] = useState(0)
  const [response, setResponse] = useState<BatchCreateResponse | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [showParseErrors, setShowParseErrors] = useState(false)
  const [showServerErrors, setShowServerErrors] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importMutation = useImportCoins()

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setGlobalError('Please select a CSV file.')
      setStage('error')
      return
    }

    setFileName(file.name)
    setStage('parsing')
    setGlobalError(null)

    try {
      const result = await parseCSVFile(file)
      setValidRows(result.validRows)
      setParseErrors(result.errors)
      setTotalParsed(result.totalRows)

      if (result.validRows.length === 0) {
        setGlobalError(
          result.errors.length > 0
            ? `All ${result.totalRows} rows had errors. Fix your CSV and try again.`
            : 'No data rows found in the CSV file.'
        )
        setStage('error')
      } else if (result.validRows.length > 500) {
        setGlobalError(`CSV has ${result.validRows.length} valid rows, but the maximum is 500 per import. Please split your file into smaller batches.`)
        setStage('error')
      } else {
        setStage('preview')
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to parse CSV')
      setStage('error')
    }
  }, [])

  const handleImport = useCallback(() => {
    if (validRows.length === 0) return

    setStage('importing')

    importMutation.mutate(validRows as any, {
      onSuccess: (data) => {
        setResponse(data)
        setStage('complete')
      },
      onError: (error) => {
        setGlobalError(error.message)
        setStage('error')
      },
    })
  }, [validRows, importMutation])

  const handleReset = () => {
    setStage('idle')
    setFileName('')
    setValidRows([])
    setParseErrors([])
    setTotalParsed(0)
    setResponse(null)
    setGlobalError(null)
    setShowParseErrors(false)
    setShowServerErrors(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const serverFailures = response?.results.filter(r => !r.success) || []

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Import CSV</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Idle / File Select */}
          {(stage === 'idle' || stage === 'parsing') && (
            <div>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-400 bg-blue-900/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {stage === 'parsing' ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="w-10 h-10 text-blue-400 animate-spin" />
                    <p className="text-slate-300">Parsing {fileName}...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-10 h-10 text-slate-500" />
                    <p className="text-slate-300">Drop a CSV file here or click to browse</p>
                    <p className="text-slate-500 text-sm">
                      Supports the same format as the Export feature
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
            </div>
          )}

          {/* Preview */}
          {stage === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-300">
                <FileText className="w-5 h-5" />
                <span className="font-medium">{fileName}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{totalParsed}</div>
                  <div className="text-xs text-slate-400">Rows Parsed</div>
                </div>
                <div className="bg-green-900/30 border border-green-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{validRows.length}</div>
                  <div className="text-xs text-green-400/70">Ready to Import</div>
                </div>
                {parseErrors.length > 0 && (
                  <div className="bg-orange-900/30 border border-orange-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-400">{parseErrors.length}</div>
                    <div className="text-xs text-orange-400/70">Skipped</div>
                  </div>
                )}
              </div>

              {parseErrors.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowParseErrors(!showParseErrors)}
                    className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {showParseErrors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {parseErrors.length} row{parseErrors.length !== 1 ? 's' : ''} will be skipped
                  </button>
                  {showParseErrors && (
                    <div className="mt-2 bg-slate-900/50 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
                      {parseErrors.map((err, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-orange-400">Row {err.row}:</span>{' '}
                          <span className="text-slate-400">{err.error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleImport}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Upload className="w-5 h-5" />
                Import {validRows.length} Coin{validRows.length !== 1 ? 's' : ''}
              </button>
            </div>
          )}

          {/* Importing */}
          {stage === 'importing' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader className="w-10 h-10 text-blue-400 animate-spin" />
              <p className="text-slate-300">Importing {validRows.length} coins...</p>
            </div>
          )}

          {/* Complete */}
          {stage === 'complete' && response && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle className="w-12 h-12 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Import Complete</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-900/30 border border-green-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{response.successCount}</div>
                  <div className="text-xs text-green-400/70">Imported</div>
                </div>
                {response.failureCount > 0 && (
                  <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-400">{response.failureCount}</div>
                    <div className="text-xs text-red-400/70">Failed</div>
                  </div>
                )}
              </div>

              {serverFailures.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowServerErrors(!showServerErrors)}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    {showServerErrors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {serverFailures.length} row{serverFailures.length !== 1 ? 's' : ''} failed on server
                  </button>
                  {showServerErrors && (
                    <div className="mt-2 bg-slate-900/50 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
                      {serverFailures.map((err, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-red-400">Row {err.row}:</span>{' '}
                          <span className="text-slate-400">{err.error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Import Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {stage === 'error' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-4">
                <AlertTriangle className="w-12 h-12 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Import Error</h3>
                <p className="text-slate-400 text-center text-sm">{globalError}</p>
              </div>

              {parseErrors.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowParseErrors(!showParseErrors)}
                    className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {showParseErrors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    View row errors
                  </button>
                  {showParseErrors && (
                    <div className="mt-2 bg-slate-900/50 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
                      {parseErrors.map((err, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-orange-400">Row {err.row}:</span>{' '}
                          <span className="text-slate-400">{err.error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleReset}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
