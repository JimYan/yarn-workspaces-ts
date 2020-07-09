import a, {a as av, c} from '@quramy/x-a';

console.log(a(10));
console.log(av());
console.log(c());

const b = () => {
    return 'thisisb';
};

export {b};
