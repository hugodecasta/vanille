import { div, divabs, EventHandler, jsoncopy } from "./components.js"

// ------------------------------------------------- VIEWPORT

export default class VIEWPORT extends EventHandler {

    offset = { x: 0, y: 0 }
    zoom = 1
    viewer = undefined
    mouse_start = undefined
    stoppers = []
    mouse = { x: 0, y: 0 }

    constructor() {
        super()
        this.viewer = div()
        const viewport_object = this.viewer
        viewport_object.set_style({
            position: 'fixed',
            left: '0px',
            top: '0px',
            width: '3px',
            'z-index': -10,
        })

        const mousedown = (e) => {
            const { button, clientX, clientY } = e
            this.mouse = { ...this.get_true_position(clientX, clientY), cx: clientX, cy: clientY }
            e.mouse = jsoncopy(this.mouse)
            this.trigger_event('click', e)
            if (button != 1) return
            this.mouse_start = { x: clientX, y: clientY }
        }
        const mouseup = () => {
            this.mouse_start = null
        }
        const mousemove = (e) => {
            const { clientX, clientY } = e
            this.mouse = { ...this.get_true_position(clientX, clientY), cx: clientX, cy: clientY }
            e.mouse = jsoncopy(this.mouse)
            this.trigger_event('mousemove', e)
            if (!this.mouse_start) return
            const dx = clientX - this.mouse_start.x
            const dy = clientY - this.mouse_start.y
            this.mouse_start = { x: clientX, y: clientY }
            this.offset.x += dx
            this.offset.y += dy
            this.update()
        }
        const wheel = ({ deltaY }) => {
            const mult = deltaY > 0 ? 0.9 : 1.1
            const { cx, cy } = this.mouse
            const { x: x1, y: y1 } = this.get_true_position(cx, cy)
            this.zoom *= mult
            const { x: x2, y: y2 } = this.get_true_position(cx, cy)
            this.offset.x += (x2 - x1) * this.zoom
            this.offset.y += (y2 - y1) * this.zoom
            this.update()
        }

        window.addEventListener('mousedown', mousedown)
        window.addEventListener('mouseup', mouseup)
        window.addEventListener('mousemove', mousemove)
        window.addEventListener('wheel', wheel)

        this.stoppers.push(() => {
            window.removeEventListener('mousedown', mousedown)
            window.removeEventListener('mouseup', mouseup)
            window.removeEventListener('mousemove', mousemove)
            window.removeEventListener('wheel', wheel)
        })
    }

    end() {
        this.stoppers.forEach(s => s())
    }

    get_true_position(x, y) {
        return {
            x: (x - this.offset.x) / this.zoom,
            y: (y - this.offset.y) / this.zoom,
        }
    }


    update() {
        this.viewer.set_style({
            left: this.offset.x + 'px',
            top: this.offset.y + 'px',
            transform: 'scale(' + this.zoom + ')'
        })
        this.trigger_event('change', this.mouse)
    }

    add(...content) {
        this.viewer.add(...content)
    }

    apply_offset(offset) {
        this.offset = offset ?? this.offset
        this.update()
    }
}