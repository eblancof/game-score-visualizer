import React, { useState } from 'react';

interface DateRangePickerProps {
  onDateChange: (start: Date, end: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [dateType, setDateType] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleDateTypeChange = (type: 'single' | 'range') => {
    if (type === 'range' && singleDate && !startDate) {
      setStartDate(singleDate);
    }
    setDateType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateType === 'single' && singleDate) {
      const date = new Date(singleDate);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      onDateChange(startOfDay, endOfDay);
    } else if (dateType === 'range' && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      onDateChange(start, end);
    }
  };

  const inputClass = "border border-border rounded-xl px-4 py-2 w-full bg-muted text-foreground shadow-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all duration-200 min-w-0 [color-scheme:dark]";

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-md p-6 border border-border/50">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <label className="inline-flex items-center group cursor-pointer">
              <input
                type="radio"
                value="single"
                checked={dateType === 'single'}
                onChange={(e) => handleDateTypeChange(e.target.value as 'single' | 'range')}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-border peer-checked:border-primary peer-checked:bg-primary transition-all duration-200 ease-in-out flex items-center justify-center rounded-full">
                <div className="w-2.5 h-2.5 bg-primary-foreground rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
              </div>
              <span className="ml-2 text-foreground group-hover:text-primary transition-colors whitespace-nowrap">Single Day</span>
            </label>
            <label className="inline-flex items-center group cursor-pointer">
              <input
                type="radio"
                value="range"
                checked={dateType === 'range'}
                onChange={(e) => handleDateTypeChange(e.target.value as 'single' | 'range')}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-border peer-checked:border-primary peer-checked:bg-primary transition-all duration-200 ease-in-out flex items-center justify-center rounded-full">
                <div className="w-2.5 h-2.5 bg-primary-foreground rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
              </div>
              <span className="ml-2 text-foreground group-hover:text-primary transition-colors whitespace-nowrap">Date Range</span>
            </label>
          </div>

          <div className={`grid ${dateType === 'single' ? 'grid-cols-1 sm:grid-cols-[1fr,auto]' : 'grid-cols-1 lg:grid-cols-[2fr,auto]'} gap-4`}>
            <div className={`grid ${dateType === 'single' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-[1fr,auto,1fr]'} gap-4 items-center`}>
              {dateType === 'single' ? (
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className={inputClass}
                  required
                />
              ) : (
                <>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <span className="text-muted-foreground hidden sm:block justify-self-center">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </>
              )}
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background outline-none self-end justify-self-end"
            >
              Fetch data
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DateRangePicker;