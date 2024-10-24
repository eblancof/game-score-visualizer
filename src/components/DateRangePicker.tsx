import React, { useState } from 'react';

interface DateRangePickerProps {
  onDateChange: (start: Date, end: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [dateType, setDateType] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateType === 'single' && singleDate) {
      const date = new Date(singleDate);
      onDateChange(date, date);
    } else if (dateType === 'range' && startDate && endDate) {
      onDateChange(new Date(startDate), new Date(endDate));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="single"
            checked={dateType === 'single'}
            onChange={(e) => setDateType(e.target.value as 'single' | 'range')}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Single Day</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="range"
            checked={dateType === 'range'}
            onChange={(e) => setDateType(e.target.value as 'single' | 'range')}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Date Range</span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
        {dateType === 'single' ? (
          <input
            type="date"
            value={singleDate}
            onChange={(e) => setSingleDate(e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-auto"
          />
        ) : (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 w-full sm:w-auto"
            />
            <span className="hidden sm:inline">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 w-full sm:w-auto"
            />
          </>
        )}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default DateRangePicker;