import { create_elm, div, divfix, invert_json, listen_to } from "../components.js"
import { INTER_GAME } from "../intersocket/intergame.js"
import { create_filtered_stream } from "./audio_utils.js"
import { PEER_CONNECTOR } from "./rtc_peer_connector.js"

export class CHANNEL_SYS {

    // ------------------------------------------------------------

    constructor(session_code, user_name, channel_infos) {
        return new Promise(async ok => {

            // ------------------------------------------

            this.user_name = user_name
            this.channel_infos = channel_infos
            const my_channels = this.my_channels = {
                listen: [],
                talk: [],
            }
            this.known_channels = {
                [user_name]: my_channels
            }

            // ------------------------------------------

            const pc = await new PEER_CONNECTOR('pc4audchan-' + session_code, user_name)
            const game = this.game = await new INTER_GAME(
                'audio-channel-signal-' + session_code,
                () => { },
                () => { },

                () => ({ user_name }),
                ({ user_name }) => {
                    delete this.known_channels[user_name]
                },

                () => { },
                (topic, in_data) => {
                    if (topic == 'user_channel') {
                        const { user_name: it_user_name, listen, talk } = in_data
                        if (it_user_name == user_name) return
                        this.known_channels[it_user_name] = { listen, talk }
                    }
                }
            )

            // ------------------------------------------

            listen_to(() => this.my_channels, () => {
                game.send_data(
                    'user_channel',
                    {
                        user_name,
                        listen: my_channels.listen,
                        talk: my_channels.talk,
                    },
                    'user_channel-' + user_name)
            })

            // ------------------------------------------

            const audio_sys = divfix().add2b().set_style({ top: '', bottom: '10px' })
            listen_to(() => this.known_channels, async (known_channels) => {
                const channel_talkers_map = invert_json(
                    Object.fromEntries(
                        Object.entries(known_channels).map(([name, { talk }]) => [name, talk])
                    )
                )
                const my_listen_channels = my_channels.listen
                const talkers =
                    my_listen_channels
                        .map(channel => channel_talkers_map[channel]?.map(user => ({ user, channel })))
                        .filter(e => e)
                        .reduce((a, b) => a.concat(b), [])
                        .filter(({ user, channel }) => user != user_name || channel_infos[channel]?.loop === true)
                const new_audio = div()
                for (const { user, channel } of talkers) {
                    const filter = channel_infos[channel]?.filter ?? []
                    await new Promise((ok) => {
                        let int = setInterval(() => {
                            if (!pc.streams[user]) return
                            clearInterval(int)
                            ok()
                        })
                    })
                    const base_stream = pc.streams[user]
                    const out_stream = create_filtered_stream(base_stream, filter)
                    const audio = create_elm('audio')
                    audio.autoplay = true
                    audio.controls = true
                    audio.srcObject = out_stream
                    audio.add2(new_audio)
                }
                audio_sys.clear().add(new_audio)
            }, true)

            // ------------------------------------------

            ok(this)
        })
    }

    // ------------------------------------------------------------

    add_channel(type, name) {
        this.remove_channel(type, name)
        this.my_channels[type].push(name)
    }
    remove_channel(type, name) {
        const index = this.my_channels[type].indexOf(name)
        this.my_channels[type].splice(index, index > -1 ? 1 : 0)
    }
    clear_channels() {
        this.my_channels.listen = []
        this.my_channels.talk = []
    }
    set_channels(listen, talk) {
        this.my_channels.listen = listen
        this.my_channels.talk = talk
    }

    // ------------------------------------------------------------

    update_streams() {

    }

}