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

  const inputClass = "border border-gray-200 rounded-xl px-4 py-2 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 min-w-0";

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className={`bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-200 ${dateType === 'range' ? 'p-6 sm:p-8' : 'p-6'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6">
          {/* Radio Button Group */}
          <div className="flex items-center gap-4 sm:gap-6">
            <label className="inline-flex items-center group cursor-pointer">
              <input
                type="radio"
                value="single"
                checked={dateType === 'single'}
                onChange={(e) => handleDateTypeChange(e.target.value as 'single' | 'range')}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200 ease-in-out flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
              </div>
              <span className="ml-2 text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">Single Day</span>
            </label>
            <label className="inline-flex items-center group cursor-pointer">
              <input
                type="radio"
                value="range"
                checked={dateType === 'range'}
                onChange={(e) => handleDateTypeChange(e.target.value as 'single' | 'range')}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200 ease-in-out flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
              </div>
              <span className="ml-2 text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">Date Range</span>
            </label>
          </div>

          {/* Date Inputs and Button */}
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
                  <span className="text-gray-500 hidden sm:block justify-self-center">to</span>
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none self-end justify-self-end"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DateRangePicker;