import React, { useState } from 'react';

interface DateRangePickerProps {
  onDateChange: (start: Date, end: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onDateChange(new Date(startDate), new Date(endDate));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-4">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <span>to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Update
      </button>
    </form>
  );
};

export default DateRangePicker;