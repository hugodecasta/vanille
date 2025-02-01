//#region ------------------------------------------------------------------------------BASE INTERFACE

interface Position { x: number, y: number }

//#region ------------------------------------------------------------------------------COMPONENTS

declare module 'vanille/components' {

    interface DecoratedNODE extends HTMLElement {
        add_classe(name: string): DecoratedNODE
        add(...content: any): DecoratedNODE
        pre(...content: any): DecoratedNODE
        add2(parent: DecoratedNODE): DecoratedNODE
        inner_html(str_data: string): DecoratedNODE
        add2b(): DecoratedNODE
        set_style(style: object): DecoratedNODE
        margin(margin_data: object | number | string): DecoratedNODE
        padding(padding_data: object | number | string): DecoratedNODE
        set_attributes(attributes: object): DecoratedNODE
        clear(): DecoratedNODE
        clone(): DecoratedNODE
        update(...args: any): void
        update_on(variable: Function): DecoratedNODE
        set_updater(updater: Function): DecoratedNODE
        remove_last_updater(): DecoratedNODE
        set_on_remove(remover: Function): DecoratedNODE
        remove(): void
        set_click(func: Function): DecoratedNODE
        set_db_click(func: Function): DecoratedNODE
        set_enter(func: Function): DecoratedNODE
        inline(): DecoratedNODE
        block(): DecoratedNODE
        hide(): DecoratedNODE
        flex(set: boolean): DecoratedNODE
        grid(): DecoratedNODE
        fixed(): DecoratedNODE
        absolute(): DecoratedNODE
        relative(): DecoratedNODE
        grow(): DecoratedNODE
        wrap(): DecoratedNODE
        show(): DecoratedNODE
        containbg(inside: string, size: number, sizeh: number): DecoratedNODE
        on(evt_name: string, func: Function): DecoratedNODE
        // addEventListener(evt_name: string, func: Function): DecoratedNODE
        on_enter(func: Function): DecoratedNODE
    }

    export function add_to_elm(source: DecoratedNODE, ...content: any): DecoratedNODE
    export function pre_to_elm(source: DecoratedNODE, ...content: any): DecoratedNODE
    export function bodyAdd(...content: any): void

    // ---------------------------------------------- BASE

    export function decorate_with_setters(elm: HTMLElement): DecoratedNODE
    export function create_elm(tag: string, classes: string, ...content: any): DecoratedNODE

    // ---------------------------------------------- SIMPLE ELEMENTS

    type SelLIST = Array<any> | object

    export function updiv(updater: Function): DecoratedNODE
    export function blocker(): DecoratedNODE
    export function span(...content: any): DecoratedNODE
    export function div(classes: string, ...content: any): DecoratedNODE
    export function alink(href: string, target, ...content: any): DecoratedNODE
    export function divabs(...content: any): DecoratedNODE
    export function divabscenter(...content: any): DecoratedNODE
    export function divfix(...content: any): DecoratedNODE
    export function divrel(...content: any): DecoratedNODE
    export function svg_elm(tag: string, attrs: object): DecoratedNODE
    export function svg(viewBox: string): DecoratedNODE
    export function p(...content: any): DecoratedNODE
    export function h1(...title: any): DecoratedNODE
    export function h2(...title: any): DecoratedNODE
    export function h3(...title: any): DecoratedNODE
    export function hr(): DecoratedNODE
    export function br(): DecoratedNODE
    export function card(classes: string, ...content: any): DecoratedNODE
    export function button(name: string, onclick: Function): DecoratedNODE
    export function get_object_from_Function(obj: Function | object): any
    export function get_list(list: SelLIST): Array<any>
    export function select_options(list: SelLIST, pre_selected: any, cb: Function): DecoratedNODE
    export function selecter(list: SelLIST, cb: Function): DecoratedNODE
    export function selecter_filter(list: SelLIST, selecter_gen_func: Function, cb: Function): DecoratedNODE
    export function multi_selecter(list: SelLIST, pre_selected: Array<string>, cb: Function): DecoratedNODE
    export function input(holder: string, type: string, cb: Function): DecoratedNODE
    export function asyncInput(holder: string, type: string, set_elm: Function): DecoratedNODE

    // ---------------------------------------------- CONTENT BUTTONS

    export function content_button(name: string, cb_element_gen_func: Function, cb: Function): DecoratedNODE

    // ---- SUGAR

    export function text_button(name: string, place_holder: string, cb: Function): DecoratedNODE
    export function select_button(name: string, list: SelLIST, cb: Function): DecoratedNODE
    export function select_filter_button(name: string, list: SelLIST, cb: Function): DecoratedNODE
    export function create_search_bar(query_cb: Function, no_found_text: string, cb: Function): DecoratedNODE

    // ---------------------------------------------- UTILS

    export function uuid(): string
    export function load_releaser(timer: number, func: Function): void
    export function make_moveable(
        elm: DecoratedNODE, mover_elm: DecoratedNODE,
        init_position: Position | null, offset_position: Position | null
    ): DecoratedNODE
    export function subscibable_button(name: string): DecoratedNODE

    export class EventHandler {
        addEventListener(type: string, func: Function): void
        removeEventListener(type: string, func: Function): void
        trigger_event(type: string, ...args: any): void
        onEvent(func: Function): void
        removeOnEvent(func: Function): void
        tunnel_events(event_object: object): void
    }

    interface Listener {
        stop(): void
        trigger(...args: any): void
    }

    export function listen_to(variable: Function, action: Function, immediate: boolean, timer: number): Listener
    export function popup_pop(inside_div: DecoratedNODE, end_action: Function, button_func_maker: Function): Promise<object>
    export function dynadiv(variable_func: Function, draw_func: Function): DecoratedNODE
    export function from_table(array: Array<any>): DecoratedNODE
    export function is_mobile(): boolean
    export function file_drop_div(
        url: string, cb: Function,
        multiple: boolean,
        on_drag_enter: Function, in_drag_leave: Function, on_drop: Function
    ): DecoratedNODE
    export function make_file_drop_div(
        div: DecoratedNODE,
        url: string,
        cb: Function,
        multiple: boolean,
        on_drag_enter: Function, in_drag_leave: Function, on_drop: Function
    ): DecoratedNODE
    export function jsoncopy(json: object): object
    export function invert_json(json: object): object
    export function flatten_distinct(array: Array<any>): Array<any>
}

//#region ------------------------------------------------------------------------------ DATABASE SYSTEM

declare module 'vanille/db_systems/database' {

    type DBStoredObj = object

    export function make_sub_db_object(obj: DBStoredObj, id: string): DBStoredObj
    export function change_object_uuids(obj: DBStoredObj): DBStoredObj
    export function stop_database_update(): void

    export class DATABASE {
        object: DBStoredObj
        constructor(name: string, default_object: object, force: boolean): DATABASE
        static get(name: string, default_object: object, constant: boolean): DBStoredObj
        static set(name: string, object: object, constant: boolean): void
        static delete_prop(root: object, prop: string): void
    }
}

//#region ------------------------------------------------------------------------------ FETCH UTILS

declare module 'vanille/fetch_utils' {

    export function get_json(ep: string, op: RequestInit): Promise<JSON>
    export function set_cached_json(ep: string, op: RequestInit): void
    export function get_text(ep: string, op: RequestInit): Promise<string>
    export function post_json(ep: string, json_data: object, op: RequestInit): Promise<JSON>
    export function delete_endpoint(ep: string, op: RequestInit): Promise<JSON>

    export function get_url_parameters(): object

    export function is_touch_device(): boolean
    export function debounce_maker(func: Function, wait: number): void

    export function click_link(link: string, target: string): void
    export function download_file(filename: string, content: string): void
}

//#region ------------------------------------------------------------------------------ INPUT HANDLERS

import { EventHandler } from "./components"

declare module 'vanille/input_handler' {

    export class KEYSTATE extends EventHandler {
        DEBUG: boolean
        confront(key_code: string): boolean
        confront_one_time(key_code: string): boolean
        on_key_code(key_code: string, func: Function): void
    }

    export const main_key_state: KEYSTATE

    enum axes_name_dir {
        'LAxeX', 'LAxeY',
        'RAxeX', 'RAxeY',
    }

    enum axes_name {
        'LAxeX',
        'RAxeX',
    }

    class PADSTATE extends EventHandler {
        set_axe_threashold(name: axes_name_dir, threashold: number): void
        set_full_axe_threashold(axe_name: axes_name, threashold: number): void
        set_axes_threashold(threashold: number): void
        value(key: string): boolean | number
    }

    export const main_pad_state: PADSTATE

}

//#region ------------------------------------------------------------------------------ PROMISES

declare module "vanille/promises" {
    export function wait_time(timer_ms: number): Promise<void>
    export function pending_promise(): [Function, Function, Promise<any>]
}

//#region ------------------------------------------------------------------------------ VIEWPORT

declare module "vanille/viewport" {
    export default class VIEWPORT extends EventHandler {
        offset: Position
        zoom: number
        mouse: Position
        end(): void
        get_true_position(x: number, y: number): Position
        update(): void
        add(...content: any): VIEWPORT
        apply_offset(offset: Position): void
    }
}

//#region ------------------------------------------------------------------------------ INTERSOCKET


declare module "vanille/intersocket/interconnect" {

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

    export function get_exposed_sessions(appID: number | string, IS_url: string | undefined): Array<ExposedSession>
}

declare module "vanille/intersocket/intergame" {

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
        set_expose_data(key: string, value: value): void
        send_data(topic: string, data: any, journal_id: string): void
        defer(): void
        add_data_handler(data_handler: DataHandler): void
    }

}