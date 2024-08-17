import { EventHandler, is_mobile } from "../components.js"
import { INTER_GAME } from "../intersocket/intergame.js"

export class PEER_CONNECTOR extends EventHandler {

    // ----------------------------------- construct

    constructor(session_code, user_name, stream_constraints = { video: false, audio: true }) {
        super()
        return new Promise(async ok => {

            this.stream_constraints = stream_constraints

            const game = this.game = await new INTER_GAME(
                session_code,
                // --------------------------------- w
                () => ({ user_name }),
                async ({ user_name: remote_user_name }) => {
                    if (remote_user_name == this.user_name) return
                    this.lines[remote_user_name] = await this.produce_rtc(remote_user_name)
                    if (!this.i_initiate(remote_user_name)) {
                        game.send_data('ready', { foryou: remote_user_name, fromme: this.user_name })
                    }
                },
                // --------------------------------- g
                () => ({ user_name }),
                async ({ user_name: remote_user_name }) => {
                    if (remote_user_name == this.user_name) return
                    this.lines[remote_user_name]?.close()
                    delete this.streams[remote_user_name]
                    this.trigger_event('stream_change', this.streams)
                },
                // --------------------------------- i
                function () { },
                // --------------------------------- d
                async (topic, in_data) => {

                    // -----------------------------

                    if (topic == 'ready') {
                        const { foryou, fromme } = in_data
                        if (foryou != this.user_name) return
                        const rtc = this.lines[fromme] ??= await this.produce_rtc(fromme)
                        const offer = await rtc.createOffer({ offerToReceiveAudio: 1 })
                        rtc.setLocalDescription(offer)
                        game.send_data('offer', { foryou: fromme, fromme: this.user_name, offer })
                    }

                    // -----------------------------

                    if (topic == 'offer') {
                        const { foryou, fromme, offer } = in_data
                        if (this.user_name != foryou) return
                        const rtc = this.lines[fromme]
                        rtc.setRemoteDescription(new RTCSessionDescription(offer))
                        const answer = await rtc.createAnswer()
                        rtc.setLocalDescription(answer)
                        game.send_data('answer', { foryou: fromme, fromme: this.user_name, answer })
                    }

                    if (topic == 'answer') {
                        const { foryou, fromme, answer } = in_data
                        if (this.user_name != foryou) return
                        const rtc = this.lines[fromme]
                        rtc.setRemoteDescription(new RTCSessionDescription(answer))
                    }

                    // -----------------------------

                    if (topic == 'candidate') {
                        const { fromme, label, candidate } = in_data
                        const rtc = this.lines[fromme]
                        if (!rtc) return
                        const new_candidate = new RTCIceCandidate({
                            sdpMLineIndex: label,
                            candidate: candidate
                        })
                        rtc.addIceCandidate(new_candidate)
                    }
                },
            )

            // -----------------------------

            this.stream = null
            this.user_name = user_name

            this.streams = {}
            this.lines = {}
            this.get_stream().then(stream => this.streams[user_name] = stream)

            ok(this)
        })
    }

    // ----------------------------------- stream

    async get_stream() {
        // window.stream_file = is_mobile() ? '/audio_test/matelot.wav' : '/audio_test/test.wav'
        if (window.stream_file && !this.stream) {
            if (!this.stream) {
                const audio_context = new AudioContext()
                const mediaStreamDestination = audio_context.createMediaStreamDestination()

                const response = await fetch(window.stream_file)
                const arrayBuffer = await response.arrayBuffer()
                const audio_buffer = await audio_context.decodeAudioData(arrayBuffer)

                const source = audio_context.createBufferSource()
                source.buffer = audio_buffer
                source.loop = true
                source.connect(mediaStreamDestination)
                source.start(0)

                this.stream = mediaStreamDestination.stream
            }
        }
        else {
            this.stream ??= await navigator.mediaDevices.getUserMedia(this.stream_constraints)
        }
        return this.stream
    }

    // ----------------------------------- connect

    async produce_rtc(remote_user_name) {
        const rtc = new RTCPeerConnection({
            'iceServers': [
                { 'url': 'stun:stun.services.mozilla.com' },
                { 'url': 'stun:stun.l.google.com:19302' }
            ]
        })
        rtc.addStream(await this.get_stream())
        rtc.onicecandidate = (event) => {
            if (!event.candidate) return
            this.game.send_data('candidate', {
                fromme: this.user_name,
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
            })
        }
        rtc.onaddstream = ({ stream }) => {
            this.streams[remote_user_name] = stream
            this.trigger_event('stream_change', this.streams)
        }
        return rtc
    }

    i_initiate(remote_user_name) {
        return remote_user_name < this.user_name
    }
}