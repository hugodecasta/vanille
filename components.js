export function add_to_elm(source, ...content) {
    for (let e of content) {
        source.components?.push(e)
        if (e.comp_parent) e.comp_parent = source
        if (typeof (e) == 'number') {
            e = '' + e
        }
        if (typeof (e) == 'string') {
            const inner = document.createElement('span')
            inner.innerHTML = e
            e = inner
        }
        source.appendChild(e)
        e.update?.()
    }
    return source
}

export function bodyAdd(...content) {
    return add_to_elm(document.body, ...content)
}

// ---------------------------------------------- BASE

export function decorate_with_setters(elm) {
    elm.addClasse = (name) => {
        name.split(' ').forEach(c => elm.classList.add(c))
        return elm
    }
    elm.add = (...content) => {
        add_to_elm(elm, ...content)
        return elm
    }
    elm.add2 = (parent) => {
        add_to_elm(parent, elm)
        return elm
    }
    elm.add2b = (parent) => {
        bodyAdd(elm)
        return elm
    }
    elm.set_style = (style) => {
        for (const id in style) {
            elm.style[id] = style[id]
            if (style[id] == null) elm.style.removeProperty(id)
        }
        return elm
    }
    elm.set_attributes = (attributes) => {
        for (const attr in attributes) elm.setAttribute(attr, attributes[attr])
        return elm
    }
    elm.clear = () => {
        elm.components = []
        elm.innerHTML = ''
        return elm
    }
    elm.clone = () => {
        return decorate_with_setters(elm.cloneNode(true))
    }

    elm.updaters = []
    elm.update = (...args) => elm.updaters.forEach(u => u.call(elm, ...args))
    elm.update_on = (variable) => {
        listen_to(variable, [elm.update])
        elm.update()
    }
    elm.set_updater = (updater) => {
        elm.updaters.push(updater)
        return elm
    }
    elm.remove_last_updater = () => {
        elm.updaters.splice(elm.updaters.length - 1, 1)
    }


    elm.removers = []
    elm.set_on_remove = (remover) => {
        elm.removers.push(remover)
        return elm
    }
    const old_remove = elm.remove
    elm.remove = () => {
        elm.removers.forEach(f => f())
        old_remove.call(elm)
        if (elm.comp_parent?.components) {
            const index = elm.comp_parent.components.indexOf(elm)
            elm.comp_parent.components.splice(index, 1)
        }
    }

    elm.components = []
    elm.set_updater((...args) => elm.components.forEach(c => c?.update?.(...args)))

    return elm
}

export function create_elm(tag = 'div', classes = '', ...content) {
    const elm = document.createElement(tag)
    if (classes) {
        if (!Array.isArray(classes)) classes = classes.split(' ').filter(e => e)
        for (const classe of classes) elm.classList.add(classe)
    }
    add_to_elm(elm, ...content)
    decorate_with_setters(elm)
    return elm
}

// ---------------------------------------------- SIMPLE ELEMENTS

export function updiv(updater) {
    const d = div()
    updater.call(d)
    return d
}

export function blocker() {
    const elm = div()
    elm.set_style({
        position: 'fixed',
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px',
        top: 0, left: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.5)'
    })
    bodyAdd(elm)
    return elm
}

export function span(...content) {
    return create_elm('span', '', ...content)
}

export function div(classes, ...content) {
    return create_elm('div', classes, ...content)
}

export function alink(href, target = '', ...content) {
    return create_elm('a', '', ...content).set_attributes({ href, target })
}

export function divabs(...content) {
    const d = div('', ...content)
    d.set_style({ position: 'absolute', top: '0px', left: '0px' })
    return d
}

export function divfix(...content) {
    const d = div('', ...content)
    d.set_style({ position: 'fixed', top: '0px', left: '0px' })
    return d
}

export function divrel(...content) {
    const d = div('', ...content)
    d.set_style({ position: 'relative' })
    return d
}

export function svg_elm(tag = 'svg', attrs = {}) {
    const elm = document.createElementNS('http://www.w3.org/2000/svg', tag)
    decorate_with_setters(elm)
    elm.set_attributes(attrs)
    return elm
}

export function svg(viewBox) {
    return svg_elm('svg', { viewBox })
}

export function p(...content) {
    return create_elm('p', '', ...content)
}

export function h1(...title) {
    return create_elm('h1', '', ...title)
}

export function h2(...title) {
    return create_elm('h2', '', ...title)
}

export function h3(...title) {
    return create_elm('h3', '', ...title)
}

export function hr() {
    return create_elm('hr')
}

export function br() {
    return create_elm('br')
}

export function card(classes, ...content) {
    return create_elm('div', 'card ' + classes, ...content)
}

export function button(name, onclick) {
    const btn = create_elm('button', '', name)
    btn.onclick = (...args) => onclick(btn, ...args)
    return btn
}

export function get_object_from_function(obj) {
    if (typeof obj == 'function') return obj()
    return obj
}

export function get_list(list) {
    list = typeof (list) == 'function' ? list() : list
    if (Array.isArray(list)) {
        list = Object.fromEntries(list.map(elm => [elm, elm]))
    }
    return list
}

export function select_options(list, pre_selected, cb) {
    const select = create_elm('select')
    list = get_list(list)
    for (const elm_name in list) {
        const elm_value = list[elm_name]
        const option = create_elm('option', '', elm_name)
        select.add(option)
        if (elm_name == pre_selected) {
            option.setAttribute('selected', true)
        }
        option.value = elm_value
    }
    select.onchange = () => cb(select.value)
    return select
}

export function selecter(list, cb) {
    list = get_list(list)
    const lister = div('card selecter')
    for (const elm_name in list) {
        const btn = button(elm_name, () => cb(list[elm_name]))
        btn.addEventListener('keydown', (evt) => {
            if (evt.key == 'Enter') cb(list[elm_name])
        })
        btn.tabIndex = '5'
        btn.classList.add('flat')
        lister.appendChild(btn)
    }
    return lister
}

export function selecter_filter(list, selecter_gen_func, cb) {
    const elm = div()

    const inp = input('', 'text', () => { })
    elm.appendChild(inp)
    const shower = div()
    elm.appendChild(shower)

    inp.addEventListener('keyup', () => {
        const search = inp.value.toLocaleLowerCase()
        shower.innerHTML = ''
        if (search.length < 2) return
        const full_list = get_list(list)
        const sub_list = Object.fromEntries(Object.entries(full_list)
            .filter(([e,]) => e.toLocaleLowerCase().includes(search)))
        const selecter = selecter_gen_func(sub_list, (...args) => {
            cb(...args)
        })
        shower.appendChild(selecter)
    })

    setTimeout(() => inp.focus(), 10)
    elm.style.display = 'inline-block'
    return elm
}

export function multi_selecter(list, pre_selected = [], cb) {
    list = get_list(list)
    const lister = div('card multi_selecter')
    if (Array.isArray(list)) {
        list = Object.fromEntries(list.map(elm => [elm, elm]))
    }
    pre_selected = pre_selected.filter(e => e)
    let selected = Object.fromEntries(pre_selected.map(ps => [ps, true]))
    for (const elm_name in list) {
        const real_value = list[elm_name]
        function update_me() {
            const color = selected[real_value] ? '#bbb' : '#fff'
            btn.style.backgroundColor = color
        }
        const btn = button(elm_name, () => {
            selected[real_value] = !!!selected[real_value]
            update_me()
        })
        update_me()
        btn.classList.add('flat')
        lister.appendChild(btn)
    }
    lister.appendChild(button('OK', () => cb(Object.keys(selected).filter(s => selected[s]))))
    return lister
}

function replace_old_func(elm, func_name, func) {
    const old_func = elm[func_name]
    elm[func_name] = () => {
        const caller = () => old_func.call(elm)
        func(caller)
        return elm
    }
}

export function input(holder = '', type = 'text', cb = () => { }, use_enter_key = true) {
    const is_checkbox = type.toLocaleLowerCase() == 'checkbox'
    const input = type.toLocaleLowerCase() == 'textarea' ? create_elm('textarea') : create_elm('input')
    input.setAttribute('type', type)
    input[is_checkbox ? 'checked' : 'value'] = holder

    let change_function_name = 'onchange'
    if (type.toLocaleLowerCase() == 'date') {
        change_function_name = 'onblur'
    }
    input[change_function_name] = () => cb(is_checkbox ? input.checked : input.value)
    input['onblur'] = () => cb(is_checkbox ? input.checked : input.value)

    input.onkeyup = (evt) => {
        if (evt.key == 'Enter' && use_enter_key) cb(is_checkbox ? input.checked : input.value)
    }

    replace_old_func(input, 'focus', (caller) => {
        setTimeout(caller, 10)
    })

    replace_old_func(input, 'select', (caller) => {
        setTimeout(caller, 10)
    })

    return input
}

export function asyncInput(holder = '', type = '', set_elm = () => { }) {
    if (!set_elm) return
    let resolve = null
    const inp = input(holder, type, resolve)
    set_elm(inp)
    inp.focus()
    return new Promise(ok => resolve = ok)
}

// ---------------------------------------------- CONTENT BUTTONS

export function content_button(name, cb_element_gen_func, cb) {
    const btn = button(name, () => {
        const mouse_handler = (evt) => {
            if (!cb_em.contains(evt.target)) ender(null)
        }
        const key_down = (evt) => {
            if (evt.key == 'Enter') {
                ender(cb_em.value ?? null)
            }
            else if (evt.key == 'Escape') {
                ender(null)
            }
        }
        let ended = false
        async function ender(result) {
            if (ended) return
            ended = true
            window.removeEventListener('mouseup', mouse_handler)
            window.removeEventListener('keydown', key_down)
            let setter = cb_em
            function set_elm(elm) {
                setter.replaceWith(elm)
                setter = elm
            }
            await cb(result, set_elm)
            const new_btn = content_button(name, cb_element_gen_func, cb)
            setter.replaceWith(new_btn)
            new_btn.focus()
        }
        window.addEventListener('mouseup', mouse_handler)
        window.addEventListener('keydown', key_down)
        const cb_em = cb_element_gen_func(result => ender(result))
        btn.replaceWith(cb_em)
        cb_em.focus()
    })
    return btn
}

// ---- SUGAR

export function text_button(name, place_holder, cb) {
    return content_button(name, (btn_cb) => input(place_holder, 'text', btn_cb), cb)
}

export function select_button(name, list, cb) {
    return content_button(name, (btn_cb) => selecter(list, btn_cb), cb)
}

export function select_filter_button(name, list, cb) {
    return content_button(name, (btn_cb) => selecter_filter(list, (sub_list, cb) => selecter(sub_list, cb), btn_cb), cb)
}

export function create_search_bar(query_cb, no_found_text = 'no found', cb) {

    const sub_div = create_elm('span')
    const inp = input('', '', () => { })
    let current_ids = []
    function select(selected) {
        sub_div.innerHTML = ''
        inp.value = ''
        if (selected == null) return
        cb(selected)
    }
    inp.addEventListener('keyup', () => {
        const query = inp.value
        sub_div.innerHTML = ''
        if (query.length < 3) return
        const list = query_cb(query)
        if (Object.keys(list).length == 0) {
            list[no_found_text] = null
        }
        current_ids = Object.values(list)
        const lister = selecter(list, select)
        sub_div.appendChild(lister)
    })

    const bar = create_elm('div', '', inp, sub_div)

    window.addEventListener('mousedown', (evt) => {
        if (!bar.contains(evt.target)) {
            select(null)
        }
    })

    window.addEventListener('keydown', (evt) => {
        if (evt.key == 'Enter') {
            select(current_ids[0])
        }
    })

    setTimeout(() => inp.focus(), 100)

    return bar
}

// ---------------------------------------------- UTILS

export function uuid() {
    return self.crypto.randomUUID?.() ?? Math.random() + '-' + Math.random()
}

export function load_releaser(timer, func) {
    let to = null
    return (...args) => {
        if (to) return
        to = setTimeout(() => {
            to = null
            func(...args)
        }, timer)
    }
}

export function make_moveable(elm, mover_elm, init_position = null, offset_position = null) {

    const position_css = init_position ?
        { left: init_position.x + 'px', top: init_position.y + 'px' } :
        {}

    elm.set_style({
        position: 'absolute',
        ...position_css,
    })

    mover_elm.set_style({
        cursor: 'pointer',
        userSelect: 'none',
    })

    let coord_differ = null
    let coord_start = null

    function mouse_move(evt) {
        if (coord_differ) {
            let offset = { x: 0, y: 0, scale: 1 }
            if (offset_position) {
                offset = offset_position
                if (typeof offset_position == 'function')
                    offset = offset_position()
            }
            let x = evt.clientX + coord_differ.x
            let y = evt.clientY + coord_differ.y
            x -= offset.x
            y -= offset.y
            elm.set_style({
                left: x * (1 / offset.scale) + 'px',
                top: y * (1 / offset.scale) + 'px'
            })
            if (elm.onmove) {
                elm.onmove(x, y, coord_start)
            }
        }
    }

    function mouse_down(evt) {
        if (mover_elm.contains(evt.target) && evt.button == 0) {
            const coords = elm.getBoundingClientRect()
            coord_start = coords
            coord_differ = { x: coords.x - evt.clientX, y: coords.y - evt.clientY }
        }
    }

    function mouse_up(evt) {
        coord_differ = null
    }

    window.addEventListener('mousemove', mouse_move)
    window.addEventListener('mousedown', mouse_down)
    window.addEventListener('mouseup', mouse_up)

}

export function subscibable_button(name) {
    const subs = []
    const btn = button(name, (...args) => {
        for (const sub of subs) sub(...args)
    })
    btn.subscribe = (func) => {
        subs.push(func)
    }
    btn.unsubscribe = (func) => {
        subs.splice(subs.indexOf(func))
    }
    return btn
}

export class EventHandler {

    handlers = {}
    all_handlers = []

    addEventListener(type, func) {
        if (!this.handlers[type]) this.handlers[type] = []
        this.handlers[type].push(func)
    }

    removeEventListener(type, func) {
        this.handlers[type]?.splice(this.handlers[type]?.indexOf(func), 1)
    }

    trigger_event(type, ...args) {
        if (this.handlers[type]) this.handlers[type].forEach(f => f(...args))
        this.all_handlers.forEach(f => f(type, ...args))
    }

    onEvent(func) {
        this.all_handlers.push(func)
    }

    removeOnEvent(func) {
        this.all_handlers.splice(this.all_handlers.indexOf(func), 1)
    }

    tunnel_events(event_object) {
        event_object.onEvent((type, ...args) => this.trigger_event(type, ...args))
    }

}

export function listen_to(variable, action, immediate = false) {
    if (!Array.isArray(action)) action = [action]
    if (typeof variable != 'function') {
        const variable_uni = variable
        variable = () => variable_uni
    }
    let past = JSON.stringify(variable())
    const int = setInterval(() => {
        const current = JSON.stringify(variable())
        try {
            if (current != past) {
                action.forEach(f => f())
                past = current
            }
        } catch (e) {
            console.error(e)
            return clearInterval(int)
        }
    }, 10)
    if (immediate) {
        action.forEach(f => f())
    }
}

export async function popup_pop(inside_div, end_action, button_func_maker) {
    return new Promise((ok) => {

        const back = divfix().add2b().set_style({
            top: '0px', left: '0px',
            width: '100%',
            height: '100%',
            background: '#000',
            opacity: 0.5,
            zIndex: 1000000000
        })
        const popup = divfix().add2b().add(inside_div).set_style({
            top: '50%', left: '50%',
            maxWidth: '500px',
            background: '#fff',
            padding: '10px',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000000000
        })

        function end(data) {
            back.remove()
            popup.remove()
            ok(data)
        }

        popup.add(
            hr(),
        )
        if (button_func_maker) {
            const end_buttons = button_func_maker(end)
            popup.add(end_buttons)
        }
        else {
            popup.add(
                button('OK', () => end(end_action())),
                button('Cancel', () => end(null)),)
        }

    })

}

export function dynadiv(variable_func, draw_func) {
    const dyv = div()
    dyv.set_updater(() => {
        dyv.clear()
        draw_func.call(dyv, variable_func())
    })
    listen_to(variable_func, dyv.update, true)
    return dyv
}

export function from_table(array) {
    return create_elm('table').add(
        ...array.map(line => create_elm('tr').add(...line.map(elm => create_elm('td', '', elm))))
    )

}