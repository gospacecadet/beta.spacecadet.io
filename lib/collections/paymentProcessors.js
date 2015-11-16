PaymentProcessors = new Mongo.Collection("paymentProcessors");

PaymentProcessors.permit(['insert', 'update', 'remove']).never().apply();
