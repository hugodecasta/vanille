import socketio
import time

# Create a socket.io client instance


def connect_session(session_code, on_journal_data, init, IS_url='https://intersocket.hugocastaneda.fr'):

    socket = socketio.Client()

    def fake_sender(a, b):
        pass
    if not socket.connected:
        try:
            socket.connect(IS_url)
        except:
            print('DISCONNECTED SOCKER, using fake sender !')
            return fake_sender

    def session_topic(topic):
        return f'session_{session_code}_{topic}'

    # ----------------------------------------------------------- ON DATA

    if on_journal_data is not None:
        @socket.on(session_topic('data'))
        def on_data(data):
            journal_id = data['journal_id']
            content = data['data']
            on_journal_data(journal_id, content)

    # ----------------------------------------------------------- ON JOURNAL

    @socket.on(session_topic('journal'))
    def on_journal(journal):
        if init is not None:
            init(journal)
        if on_journal_data is not None:
            for journal_id, content in journal.items():
                on_journal_data(journal_id, content)

    # ----------------------------------------------------------- SEND DATA

    def send_data(journal_id, data):
        try:
            socket.emit(session_topic('data'), {'journal_id': journal_id, 'data': data})
        except Exception as e:
            # socket = socketio.Client()
            # if not socket.connected:
            #     socket.connect(IS_url)
            print('could not send data...', e)
            import os
            os._exit(0)
            time.sleep(1)

    # ----------------------------------------------------------- CONNECT

    socket.emit('connect_session', session_code)
    socket.emit(session_topic('journal'))

    # Wait for connection confirmation
    while not socket.connected:
        socket.sleep(0.1)  # Sleep briefly to avoid busy-waiting

    return send_data

# Usage Example:
# send_data = connect_session('your_session_code', on_journal_data_callback, init_callback)
# send_data('journal_id', 'your_data')
