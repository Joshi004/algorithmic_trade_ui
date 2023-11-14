import * as Helper from './TradeSessionCardHelper';

describe('formatDuration', () => {
    it('formats duration correctly', () => {
      expect(Helper.formatDuration(0)).toBe('0m');
      expect(Helper.formatDuration(59)).toBe('59m');
      expect(Helper.formatDuration(60)).toBe('1h 0m');
      expect(Helper.formatDuration(61)).toBe('1h 1m');
      expect(Helper.formatDuration(1440)).toBe('1d');
      expect(Helper.formatDuration(1500)).toBe('1d 1h 0m');
      expect(Helper.formatDuration(1501)).toBe('1d 1h 1m');
    });
  });


  describe('formatTime', () => {
    it('formats time correctly', () => {
        const date = new Date('December 17, 1995 03:24:00');
        expect(Helper.formatTime(date.toString())).toBe('3:24:00 AM');
        
        const date2 = new Date('December 17, 1995 15:24:00');
        expect(Helper.formatTime(date2.toString())).toBe('3:24:00 PM');
    });
});

describe('calculateDuration', () => {
    it('calculates duration correctly', () => {
        const started_at = new Date('2023-01-01T00:00:00Z');
        const closed_at = new Date('2023-01-01T01:00:00Z');
        expect(Helper.calculateDuration(started_at.toISOString(), closed_at.toISOString())).toBe('1h 0m'); // 60 minutes

        const started_at2 = new Date('2023-01-01T00:00:00Z');
        const closed_at2 = new Date('2023-01-02T00:00:00Z');
        expect(Helper.calculateDuration(started_at2.toISOString(), closed_at2.toISOString())).toBe('1d'); // 1440 minutes = 1 day
    });
});
