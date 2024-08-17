
// ----------------------------------------------------------------------------- FILTER SYSTEM

export function create_filtered_stream(stream, filters = []) {

    if (!filters.length) return stream

    const audioContext = new AudioContext()

    const source = audioContext.createMediaStreamSource(stream)
    const destination = audioContext.createMediaStreamDestination()

    let last_node = source
    filters.forEach(filter => {
        const me = filter(audioContext)
        last_node.connect(me)
        last_node = me
    })
    last_node.connect(destination)

    return destination.stream
}

// ----------------------------------------------------------------------------- MODULES

export function lowpass_anode(freq) {
    return function (audio_context) {
        const node = audio_context.createBiquadFilter()
        node.type = "lowpass"
        node.frequency.value = freq
        return node
    }
}

export function highpass_anode(freq) {
    return function (audio_context) {
        const node = audio_context.createBiquadFilter()
        node.type = "highpass"
        node.frequency.value = freq
        return node
    }
}

export function gain_anode(gain) {
    return function (audio_context) {
        const node = audio_context.createGain()
        node.gain.value = gain
        return node
    }
}

export function delay_anode(delay) {
    return function (audio_context) {
        const node = audio_context.createDelay()
        node.delayTime.value = delay
        return node
    }
}

export function echo_anode(gain1, lowpass1, delay, gain2, lowpass2) {

    return function (audio_context) {
        const g1 = gain_anode(gain1)(audio_context)
        const lp1 = lowpass_anode(lowpass1)(audio_context)

        const del = delay_anode(delay)(audio_context)

        const g2 = gain_anode(gain2)(audio_context)
        const lp2 = lowpass_anode(lowpass2)(audio_context)

        const input = gain_anode(1)(audio_context)
        const output = gain_anode(1)(audio_context)

        input.connect(output)
        input
            .connect(g1).connect(lp1)
            .connect(del)
            .connect(g2).connect(lp2)
            .connect(del)
        del.connect(output)

        input.connect = function (target) {
            output.connect(target)
        }

        return input

    }
}

export function distortion_anode(distortion) {
    return function (audio_context) {
        const node = audio_context.createWaveShaper()
        node.curve = makeDistortionCurve(distortion)
        node.oversample = "4x"
        return node
    }
}

// var SlapbackDelayNode = function (audioContext, pp1, gg1, d, pp2, gg2) {
//     //create the nodes we'll use
//     const input = audioContext.createGain()
//     const output = audioContext.createGain()

//     const p1 = lp(audioContext, 500)
//     const g1 = audioContext.createGain()

//     const p2 = lp(audioContext, 200)
//     const g2 = audioContext.createGain()

//     const delay = audioContext.createDelay()

//     p1.frequency.value = pp1
//     g1.gain.value = gg1

//     delay.delayTime.value = d

//     p2.frequency.value = pp2
//     g2.gain.value = gg2

//     input.connect(output)
//     input.connect(p1).connect(g1).connect(delay)
//     delay.connect(p2).connect(g2).connect(delay)
//     delay.connect(output)

//     input.connect = function (target) {
//         output.connect(target)
//     }

//     return input
// }

// // ----------------------------------------------------------------------------- UTILS

function makeDistortionCurve(amount) {
    const n_samples = 44100
    const curve = new Float32Array(n_samples)
    const deg = Math.PI / 180
    for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2 / n_samples) - 1
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
    }
    return curve
}

// function createReverbBuffer(audioContext, room_size) {
//     const sampleRate = audioContext.sampleRate
//     const length = sampleRate * room_size // 1.5 seconds of reverb
//     const impulse = audioContext.createBuffer(2, length, sampleRate)
//     const impulseL = impulse.getChannelData(0)
//     const impulseR = impulse.getChannelData(1)

//     for (let i = 0; i < length; i++) {
//         const n = length - i
//         impulseL[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 3)
//         impulseR[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 3)
//     }

//     return impulse
// }


// const filters = [
//     () => source,
//     () => {
//         const bandpassFilter = audioContext.createBiquadFilter()
//         bandpassFilter.type = "highpass"
//         bandpassFilter.frequency.value = 2000
//         bandpassFilter.Q.value = 0.1
//         return bandpassFilter
//     },
//     () => {
//         const low_pass = audioContext.createBiquadFilter()
//         low_pass.type = "lowpass"
//         low_pass.frequency.value = 900
//         low_pass.Q.value = 0.1
//         return low_pass
//     },
//     () => {
//         const compressor = audioContext.createDynamicsCompressor()
//         compressor.threshold.value = -1000 // Set threshold in dB
//         compressor.ratio.value = 12 // Set compression ratio
//         compressor.attack.value = 1 // Set attack time in seconds
//         compressor.release.value = 0 // Set release time in seconds
//         compressor.knee.value = 1 // Set knee in dB
//         // compressor.reduction.value = 0 // Set reduction to 0 to disable makeup gain
//         return compressor
//     },
//     () => {
//         const distortion = audioContext.createWaveShaper()
//         distortion.curve = makeDistortionCurve(50)
//         distortion.oversample = "4x"
//         return distortion
//     },
//     () => {
//         const gainNode = audioContext.createGain()
//         gainNode.gain.value = 2
//         return gainNode
//     },
//     () => {
//         const filterNode = audioContext.createBiquadFilter()
//         filterNode.type = 'lowshelf' // Adjust the type of filter (e.g., "lowshelf", "highshelf", "peaking", etc.)
//         filterNode.frequency.setValueAtTime(1000, audioContext.currentTime)
//         filterNode.gain.setValueAtTime(25, audioContext.currentTime)
//         return filterNode
//     },
//     () => {
//         const delayNode = audioContext.createDelay()
//         delayNode.delayTime.value = 0 // Set the delay time in seconds
//         return delayNode
//     },
//     () => {
//         const bandpassFilter = audioContext.createBiquadFilter()
//         bandpassFilter.type = "highpass"
//         bandpassFilter.frequency.value = 1000
//         return bandpassFilter
//     },
//     () => {
//         const waveShaperNode = audioContext.createWaveShaper()
//         waveShaperNode.curve = makeDistortionCurve(200)
//         waveShaperNode.oversample = '4x' // Set oversampling
//         return waveShaperNode
//     },
//     () => {
//         const bandpassFilter = audioContext.createBiquadFilter()
//         bandpassFilter.type = "highpass"
//         bandpassFilter.frequency.value = 1000
//         return bandpassFilter
//     },
//     () => {
//         const gainNode = audioContext.createGain()
//         gainNode.gain.value = 2
//         return gainNode
//     },
//     () => {
//         const convolverNode = audioContext.createConvolver()
//         convolverNode.buffer = createReverbBuffer(audioContext, 0.001)
//         return convolverNode
//     },
//     () => {
//         const gainNode = audioContext.createGain()
//         gainNode.gain.value = 1 / 0.01
//         return gainNode
//     },
//     () => {
//         const echo = new SlapbackDelayNode(audioContext, 700, 0.7, 0.4, 100, 0.3)
//         return echo
//     },
//     () => audioContext.destination,
// ]

// let last_p = null
// filters.forEach((f) => {
//     const me = f()
//     if (last_p) last_p.connect(me.input ?? me)
//     last_p = me
// })