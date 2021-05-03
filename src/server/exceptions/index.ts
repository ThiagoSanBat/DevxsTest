export function UserNotFoundException(message) {
  this.message = message;
  this.name = 'UserNotFoundException';
}

export function UserNotVerifiedException(message) {
  this.message = message;
  this.name = 'UserNotVerifiedException';
}
