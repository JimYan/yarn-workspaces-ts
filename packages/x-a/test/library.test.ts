import a, {a as af, b, c} from '../src/index';
/**
 * Dummy test
 */
describe('Dummy test', () => {
    it('works if true is truthy', () => {
        expect(1).toBe(1);
    });

    it('DummyClass is instantiable', () => {
        expect(a(10)).toBe(100);
        expect(af()).toBe('xx');
        expect(b()).toBe('bb');
        expect(c()).toContain('cc');
    });
});
