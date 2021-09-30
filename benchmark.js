var apiBenchmark = require('api-benchmark');

var service = {
    production: 'https://event-checkout-api.herokuapp.com/',
    local: 'localhost:3001/'
};

var routes = {
    // event get requests
    getEventById: 'api/events/v1?eventId=1',
    getAllEvents: 'api/events/v1/all',
    // event sessions get requests
    getEventSessionById: 'api/event-sessions/v1?eventId=1',
    // tickets sold get requests
    getTicketsSoldByEvent: 'api/sold/v1/tickets/event?eventId=1',
    getTicketsSoldByEventSession: 'api/sold/v1/tickets/event/session?eventSessionId=1',
    // cart get requests
    getCartId: 'api/cart/v1/?sessionId=8659ca98-bc55-4f86-bcf2-9d737ef7d1ca',
    getCartContentsByCartId: 'api/cart/v1/contents/by/id?cartId=11',
    getCartContentsBySessionId: 'api/cart/v1/contents/by/session?sessionId=8659ca98-bc55-4f86-bcf2-9d737ef7d1ca',
    getCartContentsTotal: 'api/cart/v1/contents/total?sessionId=8659ca98-bc55-4f86-bcf2-9d737ef7d1ca'
};

apiBenchmark.measure(service, routes, function (err, results) {
    console.log(results);
});