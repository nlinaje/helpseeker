// Whisper speech recognition service.
// Ported and cleaned up from the pwa-test spike; all three original bugs fixed.

let _pipeline = null
let _transcriber = null
let _mediaRecorder = null
let _audioChunks = []
let _mimeType = ''

// ── Library bootstrap ────────────────────────────────────────────────────────

export async function loadTransformers() {
    if (_pipeline) return
    const module = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2')
    _pipeline = module.pipeline
}

// ── Model loading ────────────────────────────────────────────────────────────

export async function loadModel(modelId = 'Xenova/whisper-tiny', onProgress) {
    if (!_pipeline) await loadTransformers()
    _transcriber = await _pipeline(
        'automatic-speech-recognition',
        modelId,
        {
            progress_callback: (p) => {
                if (p.status === 'progress' && onProgress) {
                    onProgress(Math.round(p.progress * 100))
                }
            }
        }
    )
    return _transcriber
}

export function isModelLoaded() {
    return _transcriber !== null
}

// ── Recording ────────────────────────────────────────────────────────────────

export async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Bug fix 1: detect supported MIME type for Safari/iOS
    _mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus']
        .find(t => MediaRecorder.isTypeSupported(t)) || ''

    _mediaRecorder = new MediaRecorder(stream, _mimeType ? { mimeType: _mimeType } : {})
    _audioChunks = []
    _mediaRecorder.ondataavailable = (e) => _audioChunks.push(e.data)
    _mediaRecorder.start()
}

// Returns { text, score (raw), elapsed } after transcription completes.
export function stopRecording(targetPhrase, language = 'german') {
    return new Promise((resolve, reject) => {
        _mediaRecorder.onstop = async () => {
            try {
                const blob = new Blob(_audioChunks, { type: _mimeType || 'audio/webm' })
                const result = await _transcribeBlob(blob, language)
                resolve(result)
            } catch (err) {
                reject(err)
            }
        }
        _mediaRecorder.stop()
        _mediaRecorder.stream.getTracks().forEach(t => t.stop())
    })
}

// ── Internal: transcription pipeline ────────────────────────────────────────

async function _resampleTo16k(audioBuffer) {
    const TARGET = 16000
    if (audioBuffer.sampleRate === TARGET) return audioBuffer.getChannelData(0)
    const frameCount = Math.ceil(audioBuffer.duration * TARGET)
    const offlineCtx = new OfflineAudioContext(1, frameCount, TARGET)
    const source = offlineCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(offlineCtx.destination)
    source.start(0)
    const resampled = await offlineCtx.startRendering()
    return resampled.getChannelData(0)
}

async function _transcribeBlob(blob, language) {
    const arrayBuffer = await blob.arrayBuffer()

    // Bug fix 3: fresh AudioContext per call; resume if iOS suspended it
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtx.state === 'suspended') await audioCtx.resume()
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
    audioCtx.close()

    // Bug fix 2: manually resample to 16 kHz before passing to Whisper
    const audioData = await _resampleTo16k(audioBuffer)

    const t0 = performance.now()
    const result = await _transcriber(audioData, {
        language,
        task: 'transcribe',
        sampling_rate: 16000,
    })
    const elapsed = Math.round(performance.now() - t0)

    return { text: result.text.trim(), elapsed }
}
