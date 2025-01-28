let socket = null

export function connect_session(session_code, on_journal_data, init, IS_url = 'https://intersocket.hugocastaneda.fr') {

    // if (!socket) {
    const socket = io(IS_url)
    // }

    function disconnect() {
        socket.disconnect()
    }

    function session_topic(topic) {
        return 'session_' + session_code + '_' + topic
    }

    // ----------------------------------------------------------- ON EXPOSE DATA

    const expose_data_listeners = []
    socket.on(session_topic('expose_data'), ({ key, value }) => {
        expose_data_listeners.forEach(f => f(key, value))
    })
    function on_expose_data(f) {
        expose_data_listeners.push(f)
    }

    // ----------------------------------------------------------- ON DATA

    socket.on(session_topic('data'), ({ journal_id, data }) => {
        on_journal_data(journal_id, data)
    })

    // ----------------------------------------------------------- ON JOURNAL

    socket.on(session_topic('journal'), (journal) => {
        init?.(journal)
        for (const journal_id in journal) {
            on_journal_data(journal_id, journal[journal_id])
        }
    })

    // ----------------------------------------------------------- SEND DATA

    function send_data(journal_id, data) {
        socket.emit(session_topic('data'), { journal_id, data })
    }

    // ----------------------------------------------------------- EXPOSE

    let expose_code = null
    function set_expose_data(key, value) {
        socket.emit(session_topic('expose'), { code: expose_code, key, value })
    }

    // ----------------------------------------------------------- CONNECTE

    socket.emit('connect_session', session_code)
    socket.emit(session_topic('journal'))

    return new Promise((ok) => {
        socket.on(session_topic('connected'), (sent_expose_code) => {
            expose_code = sent_expose_code
            ok({ send_data, set_expose_data, on_expose_data, disconnect })
        })
    })

}

export async function get_exposed_sessions(appID, IS_url = 'https://intersocket.hugocastaneda.fr') {
    const resp = await fetch(IS_url + '/expose/search/' + appID)
    if (!resp.ok) return null
    const list = await resp.json()
    return list
}