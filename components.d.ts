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
    update_on(variable: function): DecoratedNODE
    set_updater(updater: function): DecoratedNODE
    remove_last_updater(): DecoratedNODE
    set_on_remove(remover: function): DecoratedNODE
    remove(): void
    set_click(func: function): DecoratedNODE
    set_db_click(func: function): DecoratedNODE
    set_enter(func: function): DecoratedNODE
    inline(): DecoratedNODE
    block(): DecoratedNODE
    hide(): DecoratedNODE
    flex(set: boolean = true): DecoratedNODE
    grid(): DecoratedNODE
    fixed(): DecoratedNODE
    absolute(): DecoratedNODE
    relative(): DecoratedNODE
    grow(): DecoratedNODE
    wrap(): DecoratedNODE
    show(): DecoratedNODE
    containbg(inside: string, size: number, sizeh: number): DecoratedNODE
    on(evt_name: string, func: function): DecoratedNODE
    addEventListener(evt_name: name, func: function): DecoratedNODE
    on_enter(func: function): DecoratedNODE
}

export function add_to_elm(source: DecoratedNODE, ...content: any): DecoratedNODE
export function pre_to_elm(source: DecoratedNODE, ...content: any): DecoratedNODE
export function bodyAdd(...content: any): void

// ---------------------------------------------- BASE

export function decorate_with_setters(elm: HTMLElement): DecoratedNODE
export function create_elm(tag: string = 'div', classes: string = '', ...content: any): DecoratedNODE

// ---------------------------------------------- SIMPLE ELEMENTS

declare type SelLIST = Array | object

export function updiv(updater: function): DecoratedNODE
export function blocker(): DecoratedNODE
export function span(...content: any): DecoratedNODE
export function div(classes: string, ...content: any): DecoratedNODE
export function alink(href: string, target: string = '', ...content: any): DecoratedNODE
export function divabs(...content: any): DecoratedNODE
export function divabscenter(...content: any): DecoratedNODE
export function divfix(...content: any): DecoratedNODE
export function divrel(...content: any): DecoratedNODE
export function svg_elm(tag: string = 'svg', attrs: object = {}): DecoratedNODE
export function svg(viewBox: string): DecoratedNODE
export function p(...content: any): DecoratedNODE
export function h1(...title: any): DecoratedNODE
export function h2(...title: any): DecoratedNODE
export function h3(...title: any): DecoratedNODE
export function hr(): DecoratedNODE
export function br(): DecoratedNODE
export function card(classes: string, ...content: any): DecoratedNODE
export function button(name: string, onclick: function): DecoratedNODE
export function get_object_from_function(obj: function | object): any
export function get_list(list: SelLIST): Array
export function select_options(list: SelLIST, pre_selected: any, cb: function): DecoratedNODE
export function selecter(list: SelLIST, cb: function): DecoratedNODE
export function selecter_filter(list: SelLIST, selecter_gen_func: function, cb: function): DecoratedNODE
export function multi_selecter(list: SelLIST, pre_selected = [], cb: function): DecoratedNODE
export function input(holder = '', type = 'text', cb: function): DecoratedNODE
export function asyncInput(holder = '', type = '', set_elm: function): DecoratedNODE

// ---------------------------------------------- CONTENT BUTTONS

export function content_button(name: string, cb_element_gen_func: function, cb: function): DecoratedNODE

// ---- SUGAR

export function text_button(name: string, place_holder: string, cb: function): DecoratedNODE
export function select_button(name: string, list: SelLIST, cb: function): DecoratedNODE
export function select_filter_button(name: string, list: SelLIST, cb: function): DecoratedNODE
export function create_search_bar(query_cb: function, no_found_text = 'no found', cb: function): DecoratedNODE

// ---------------------------------------------- UTILS

export function uuid(): string
export function load_releaser(timer: number, func: function): void
export function make_moveable(elm: DecoratedNODE, mover_elm: DecoratedNODE, init_position = null, offset_position = null): DecoratedNODE
export function subscibable_button(name: string): DecoratedNODE

export class EventHandler {
    handlers = {}
    all_handlers = []
    addEventListener(type: string, func: function): void
    removeEventListener(type: string, func: function): void
    trigger_event(type: string, ...args: any): void
    onEvent(func: function): void
    removeOnEvent(func: function): void
    tunnel_events(event_object: object): void
}

interface Listener {
    stop(): void
    trigger(...args: any): void
}

export function listen_to(variable: function, action: function, immediate = false, timer = 10): Listener
export async function popup_pop(inside_div: DecoratedNODE, end_action: function, button_func_maker: function): Promise<object>
export function dynadiv(variable_func: function, draw_func: function): DecoratedNODE
export function from_table(array: Array): DecoratedNODE
export function is_mobile(): boolean
export function file_drop_div(url: string, cb: function, multiple = false, on_drag_enter = null, in_drag_leave = null, on_drop = null): DecoratedNODE
export function make_file_drop_div(div: DecoratedNODE, url: string, cb: function, multiple = false, on_drag_enter = null, in_drag_leave = null, on_drop = null): DecoratedNODE
export function jsoncopy(json: object): object
export function invert_json(json: object): object
export function flatten_distinct(array: Array): Array