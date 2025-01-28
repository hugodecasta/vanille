import { connect_session } from "./interconnect.js"

class DEFER_SYSTEM {

    constructor(rehandle_func) {

        this.defer_candidate = null
        this.defered = []

        setInterval(() => {
            const all_defered = [...this.defered]
            this.defered = []
            all_defered.forEach(defered => rehandle_func(defered))
        }, 1000)
    }

    prepare_defer(candidate) {
        this.defer_candidate = candidate
    }
    defer() {
        this.defered.push(this.defer_candidate)
    }
}

export class INTER_GAME {

    constructor(
        session_code,
        welcome, on_welcome,
        goodbye, on_goodbye,
        init, data_handler,
        force_close_ask = true,
        appID = null,
        IS_url = 'https://intersocket.hugocastaneda.fr',
    ) {

        this.data_handlers = [data_handler]
        this.on_topicers = {}

        return new Promise(async (ok) => {

            // ------------------------------------------------- defer sys
            this.defere_sys = new DEFER_SYSTEM((data) => {
                root_handler(...data)
            })

            // ------------------------------------------------- buffer
            this.buffer = []
            let buffering = true
            setTimeout(() => {
                buffering = false
                this.buffer.splice(0, 100000000)
                this.buffer = []
            }, 3000)

            // ------------------------------------------------- handler
            const root_handler = (topic, data, journal_id) => {
                this.defere_sys.prepare_defer([topic, data, journal_id])
                this.buffer.push([topic, data, journal_id])
                if (topic == 'welcome') {
                    on_welcome.call(this, data)
                }
                else if (topic == 'goodbye') {
                    on_goodbye.call(this, data)
                }
                else {
                    this.data_handlers.forEach(data_handler => data_handler.call(this, topic, data, journal_id))
                    this.on_topicers[topic]?.forEach(data_handler => data_handler.call(this, data, journal_id))
                }
            }

            // ------------------------------------------------- source session connect
            const { send_data, set_expose_data, on_expose_data, disconnect } = await connect_session(
                session_code,
                (journal_id, packet) => {
                    const { topic, data } = packet
                    root_handler(topic, data, journal_id)
                },
                (journal) => init.call(this, journal),
                IS_url
            )

            this.connected_sender = send_data
            this.disconnect = disconnect

            // ------------------------------------------------- exposed data
            const exposed_data = {}
            on_expose_data((key, value) => {
                exposed_data[key] = value
                root_handler('expose_data', JSON.parse(JSON.stringify(exposed_data)), 'expose_data')
            })
            this.data_exposer = set_expose_data
            if (appID) {
                this.set_expose_data('appID', appID)
            }

            // ------------------------------------------------- welcome goodbye
            this.left = false
            this.goodbye = goodbye
            const welcome_data = await welcome.call(this)
            this.send_data('welcome', welcome_data, 'welcome' + JSON.stringify(welcome_data) + Date.now())
            if (force_close_ask === true) {
                window.addEventListener('beforeunload', (e) => {
                    e.preventDefault()
                })
                window.addEventListener('unload', async (e) => {
                    this.leave()
                })
            }
            else if (typeof (force_close_ask) == 'function') {
                window.addEventListener('beforeunload', async (e) => {
                    e.preventDefault()
                    await this.leave()
                    force_close_ask()
                })
            }

            // ------------------------------------------------- return
            ok(this)

        })
    }

    async leave() {
        if (this.left) return
        this.left = true
        const goodbye_data = await this.goodbye.call(this)
        this.send_data('goodbye', goodbye_data, 'goodbye' + JSON.stringify(goodbye_data) + Date.now())
        // window.removeEventListener('beforeunload', this.before_unload_handler)
        setTimeout(() => this.disconnect(), 1000)
    }

    on_topic(topic, func) {
        this.on_topicers[topic] ??= []
        this.on_topicers[topic].push(func)
        this.buffer.forEach(b => func(...b))
    }

    set_expose_data(key, value) {
        this.data_exposer(key, value)
    }

    send_data(topic, data, journal_id = null) {
        journal_id ??= Math.random() * 10000000 + 'c' + Math.random() * 10000000
        this.connected_sender(journal_id, { topic, data })
    }

    defer() {
        this.defere_sys.defer()
    }

    add_data_handler(data_handler) {
        this.data_handlers.push(data_handler)
    }

}