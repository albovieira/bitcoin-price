/* eslint-disable max-classes-per-file */
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NOT_FOUND';
  }
}

class NotAuthorizedError extends Error {
  constructor(message = 'Not authorized') {
    super(message);
    this.name = 'NOT_AUTHORIZED';
  }
}

class BadRequestError extends Error {
  constructor(message = 'Invalid Request') {
    super(message);
    this.name = 'BAD_REQUEST';
  }
}

class PaymentRequiredError extends Error {
  constructor(message = 'Payment Required') {
    super(message);
    this.name = 'PAYMENT_REQUIRED';
  }
}

export {
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  PaymentRequiredError,
};
