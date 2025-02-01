type DataHandler = (topic: string, data: any, journal_id: string) => void

export class INTER_GAME {

    constructor(
        session_code: string,
        welcome: () => object, on_welcome: (player: object) => void,
        goodbye: () => object, on_goodbye: (player: object) => void,
        init: () => void, data_handler: DataHandler,
        force_close_ask: boolean,
        appID: number | string,
        IS_url: string,
    ): Promise<INTER_GAME>

    leave(): Promise<void>
    on_topic(topic: string, func: Function): void
    set_expose_data(key: string, value: string): void
    send_data(topic: string, data: any, journal_id: string): void
    defer(): void
    add_data_handler(data_handler: DataHandler): void
}
