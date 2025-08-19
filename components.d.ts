//#region ------------------------------------------------------------------------------BASE INTERFACE

interface Position { x: number, y: number }

type CSSObject = CSSStyleDeclaration

//#region ------------------------------------------------------------------------------COMPONENTS

interface DecoratedNODE extends HTMLElement {
    add_classe(name: string): DecoratedNODE
    add(...content: any): DecoratedNODE
    pre(...content: any): DecoratedNODE
    add2(parent: DecoratedNODE): DecoratedNODE
    inner_html(str_data: string): DecoratedNODE
    add2b(): DecoratedNODE
    set_style(style: CSSObject): DecoratedNODE
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
export function ul(...content: any): DecoratedNODE
export function li(...content: any): DecoratedNODE
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
export function slider(holder: number, min: number, max: number, step: number, cb: Function): DecoratedNODE
export function input(holder: string, type: string, cb: Function, use_enter_key: boolean, activate_on_blur: boolean): DecoratedNODE
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

export function listen_to(variable: Function, action: Function, immediate: boolean, timer: number, im_delay: number): Listener
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