import { EventHandler } from "./components.js"

export class KEYSTATE extends EventHandler {

    state = {}
    current_pressed = {}
    current_code_pressed = {}
    one_timer = {}
    mouse = { x: null, y: null }
    DEBUG = false

    constructor() {
        super()
        window.addEventListener('keydown', (evt) => {
            this.state = evt
            if (this.DEBUG) console.log('keydown', evt.code)
            this.current_pressed[evt.key] = true
            this.current_code_pressed[evt.code] = true
            this.trigger_event('keydown', evt, this.current_pressed)
        })
        window.addEventListener('keyup', (evt) => {
            this.state = {}
            if (this.DEBUG) console.log('keyup', evt.code)
            delete this.current_pressed[evt.key]
            delete this.current_code_pressed[evt.code]
            delete this.one_timer[evt.code]
            this.trigger_event('keyup', evt, this.current_pressed)
        })
        window.addEventListener('mousedown', (evt) => {
            this.current_code_pressed['MouseDown'] = true
            if (this.DEBUG) console.log('MouseDown')
            this.mouse.x = evt.clientX
            this.mouse.y = evt.clientY
            this.trigger_event('mousedown', evt, this.current_code_pressed)
        })
        window.addEventListener('mouseup', (evt) => {
            if (this.DEBUG) console.log('x-MouseDown')
            delete this.current_code_pressed['MouseDown']
            delete this.one_timer['MouseDown']
            this.trigger_event('mouseup', evt, this.current_code_pressed)
        })
        window.addEventListener('touchstart', (evt) => {
            this.current_code_pressed['MouseDown'] = true
            if (this.DEBUG) console.log('MouseDown')
            this.mouse.x = evt.clientX
            this.mouse.y = evt.clientY
            this.trigger_event('mousedown', evt, this.current_code_pressed)
        })
        window.addEventListener('touchend', (evt) => {
            if (this.DEBUG) console.log('x-MouseDown')
            delete this.current_code_pressed['MouseDown']
            delete this.one_timer['MouseDown']
            this.trigger_event('mouseup', evt, this.current_code_pressed)
        })
    }

    confront(key_code) {
        return key_code in this.current_code_pressed
    }

    confront_one_time(key_code) {
        if (this.one_timer[key_code]) return
        const conf = this.confront(key_code)
        if (conf) {
            this.one_timer[key_code] = true
            return true
        }
    }

    add_state_caps_text(state_condition, text) {
        this.addEventListener('keydown', () => {
            if (state_condition(this.state)) set_caps_infos(xtr_func(text))
        })
        this.addEventListener('keyup', () => {
            set_caps_infos(null)
        })
    }

}

export const main_key_state = new KEYSTATE()

const gp_btn_map = [
    'A', 'B', 'X', 'Y',
    'LB', 'RB', 'LT', 'RT',
    'Back', 'Start',
    'LAxe', 'RAxe',
    'Up', 'Down', 'Left', 'Right'
]
const gp_axe_map = ['LAxeX', 'LAxeY', 'RAxeX', 'RAxeY']

class PADSTATE extends EventHandler {

    current_pressed = {}
    current_values = {}

    axes_threashold = {
        'LAxeX': 0,
        'LAxeY': 0,
        'RAxeX': 0,
        'RAxeY': 0,
    }

    set_axe_threashold(name, threashold) {
        this.axes_threashold[name] = threashold
    }

    set_full_axe_threashold(axe_name, threashold) {
        this.set_axe_threashold(axe_name + 'X', threashold)
        this.set_axe_threashold(axe_name + 'Y', threashold)
    }

    set_axes_threashold(threashold) {
        this.set_full_axe_threashold('LAxe', threashold)
        this.set_full_axe_threashold('RAxe', threashold)
    }

    value(key) {
        return this.current_values[key] ?? 0
    }

    constructor() {
        super()

        let gamepad_index = null
        window.addEventListener("gamepadconnected", (e) => {
            gamepad_index = e.gamepad.index
        })
        window.addEventListener("gamepaddisconnected", (e) => {
            gamepad_index = null
        })

        setInterval(() => {
            if (gamepad_index == null) return
            const gamepad = navigator.getGamepads()[gamepad_index]
            const buttons = Object.fromEntries(gp_btn_map.map((btn_name, id) => {
                return [btn_name, gamepad.buttons[id].value]
            }))
            const axes = Object.fromEntries(gp_axe_map.map((axe_name, id) => {
                return [
                    axe_name,
                    (Math.abs(gamepad.axes[id]) > this.axes_threashold[axe_name] ? gamepad.axes[id] : 0)
                    * (axe_name.includes('Y') ? -1 : 1)
                ]
            }))
            const current_values = { ...buttons, ...axes }
            const current_pressed = Object.fromEntries(
                Object.keys(current_values).filter(k => current_values[k] != 0)
                    .map(k => [k, true])
            )
            for (const key in current_values) {
                if (this.current_values[key] == null) continue
                if (this.current_values[key] != current_values[key])
                    this.trigger_event('change', key, current_values[key])
            }
            this.current_values = current_values
            this.current_pressed = current_pressed

        }, 10)
    }

}

export const main_pad_state = new PADSTATE()