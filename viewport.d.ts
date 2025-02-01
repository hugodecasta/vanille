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