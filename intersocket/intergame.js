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

    constructor(session_code, welcome, on_welcome, goodbye, on_goodbye, init, data_handler, IS_url = 'https://intersocket.hugocastaneda.fr') {

        return new Promise(async (ok) => {

            this.defere_sys = new DEFER_SYSTEM((data) => {
                root_handler(...data)
            })

            const root_handler = (topic, data, journal_id) => {
                this.defere_sys.prepare_defer([topic, data, journal_id])
                if (topic == 'welcome') {
                    on_welcome(data)
                }
                else if (topic == 'goodbye') {
                    on_goodbye(data)
                }
                else {
                    data_handler(topic, data, journal_id)
                }
            }

            this.connected_sender = await connect_session(
                session_code,
                (journal_id, packet) => {
                    const { topic, data } = packet
                    root_handler(topic, data, journal_id)
                },
                init,
                IS_url
            )

            const welcome_data = welcome()
            this.send_data('welcome', welcome_data, 'welcome' + JSON.stringify(welcome_data) + Date.now())


            window.addEventListener('beforeunload', (e) => {
                e.preventDefault()
            })

            window.addEventListener('unload', (e) => {
                const goodbye_data = goodbye()
                this.send_data('goodbye', goodbye_data, 'goodbye' + JSON.stringify(goodbye_data) + Date.now())
            })

            ok(this)

        })
    }

    send_data(topic, data, journal_id = null) {
        journal_id ??= Math.random() * 10000000 + 'c' + Math.random() * 10000000
        this.connected_sender(journal_id, { topic, data })
    }

    defer() {
        this.defere_sys.defer()
    }

}