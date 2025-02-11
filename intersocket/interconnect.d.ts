interface Session_controler {
    send_data(journal_id: string, data: any): void
    set_expose_data(key: string, value: string | number): void
    on_expose_data(f: Function): void
    disconnect(): void
}

export function connect_session(
    session_code: string,
    on_journal_data: Function, init: Function,
    IS_url: string | undefined
): Promise<Session_controler>

interface ExposedSession {
    session_code: number,
    members: numbers,
    data: object
}

export function get_exposed_sessions(appID: number | string, IS_url: string | undefined): Promise<Array<ExposedSession>>
