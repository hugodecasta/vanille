export class INTERGAMEIFY {

    intergame_on_data(topic, data) {
        throw Error('Not Implemented')
    }

    intergame_sender(intergame) {
        throw Error('Not Implemented')
    }

    intergame = null
    intergame_send_register(intergame) {
        this.intergame = intergame
    }
    update_intergame() {
        if (!this.intergame) return
        this.intergame_sender(this.intergame)
    }

}


export class INTERGAMEIFY_JSONIFY extends INTERGAMEIFY {

    from_json(json_data) {
        throw Error('Not Implemented')
    }

    to_json() {
        throw Error('Not Implemented')
    }
}