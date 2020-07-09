import {b} from '../src/index';

/**
 * Dummy test
 */
describe('Dummy test', () => {
    it('works if true is truthy', () => {
        expect(1).toBe(1);
    });

    it('DummyClass is instantiable', () => {
        expect(b()).toBe('thisisb');
    });
});
