export class MissingFactoryError extends Error {
  constructor() {
    super('Factory is not defined!');
    this.name = 'MissingFactoryError';
  }
}

export class MissingFactoryMethodError extends Error {
  constructor() {
    super('Factory method is not defined!');
    this.name = 'MissingFactoryMethodError';
  }
}
