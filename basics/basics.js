import message, { name, location, getGreeting } from './module';
import add, { subtract } from './maths';

console.log(message, 'by', name, 'in', location);
console.log(getGreeting('Jessica'));

console.log(`34 + 56 = ${add(34, 56)}`);
console.log(`97 - 28 = ${subtract(99, 28)}`);
