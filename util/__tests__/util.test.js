import { getLangIcon, niceBytes } from '../util';

describe.skip('niceBytes', () => {
    it('KB', () => {
        expect(niceBytes(2148)).toBe('2.1 KB');
    });
});
