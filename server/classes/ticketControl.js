const fs = require('fs');

class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.last = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];
        let data = require('../data/data.json');

        if (data.today === this.today) {
            this.last = data.last;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.reiniciarConteo();
        }
    }

    siguiente() {
        this.last += 1;
        let ticket = new Ticket(this.last, null);
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket: ${this.last}`;
    }

    getLastTicket() {
        return `Ticket: ${this.last}`;
    }

    getUltimos4() {
        return this.ultimos4;
    }

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return 'No hay tickets en este momento';
        }

        let numeroTicket = this.tickets[0].numero;
        this.tickets.shift();

        let atenderTicket = new Ticket(numeroTicket, escritorio);
        this.ultimos4.unshift(atenderTicket);

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }
        this.grabarArchivo();

        return atenderTicket;
    }


    reiniciarConteo() {
        this.last = 0;
        this.tickets = [];
        this.ultimos4 = [];
        console.log('Se ha inicializado el servidor');
        this.grabarArchivo();
    }


    grabarArchivo() {
        let jsonData = {
            last: this.last,
            today: this.today,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }
}

module.exports = {
    TicketControl
}