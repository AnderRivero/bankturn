const { io } = require('../server');
const { TicketControl } = require('../classes/ticketControl');

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    console.log('Usuario conectado');
    // Escuchar el cliente
    client.on('siguienteTicket', (data, callback) => {
        let ticketNumer = ticketControl.siguiente();
        console.log(ticketNumer);
        callback(ticketNumer);
    });
    //suministrar el ultimo ticket
    client.emit('estadoActual', {
        actual: ticketControl.getLastTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }
        let atenderTicket = ticketControl.atenderTicket(data.escritorio);
        callback(atenderTicket);

        client.broadcast.emit('ultimos4', { ultimos4: ticketControl.getUltimos4() });

    });
    //escuchar si el cliente se desconecta
    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});