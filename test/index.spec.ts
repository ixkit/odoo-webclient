import { describe, expect, it, test } from '@jest/globals';

import { profile } from '../src';

describe('index', () => {
  describe('profile', () => {
    it('should return a string containing the message', () => {
      const seed = 'tester';
      const result = profile(seed);

      expect(result).toContain(seed)
    });
  });
});
