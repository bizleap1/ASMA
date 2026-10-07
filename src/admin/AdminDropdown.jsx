import React, { useState, useRef, useEffect } from 'react';

/**
 * Custom Theme-Aligned Dropdown for ASMA Admin
 */
export const AdminDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = '-- Select an option --',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 sm:py-3 bg-gray-50 border rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        } ${
          isOpen
            ? 'border-[#166534] ring-2 ring-[#166534]/15 bg-white'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={`text-xs sm:text-sm font-medium truncate pr-2 ${selectedOption ? 'text-text-primary' : 'text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#166534]' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-56 overflow-y-auto divide-y divide-gray-50 animate-fade-in w-full">
          {options.map((option) => {
            const isSelected = String(option.value) === String(value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-green-50/80 text-[#166534] font-bold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <span className="truncate flex-1">{option.label}</span>
                {isSelected && (
                  <span className="text-[#166534] text-xs font-bold shrink-0">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Custom Searchable Student Selector for ASMA Admin (Supports Single & Multi-Select with All option)
 */
export const AdminStudentSelect = ({
  value,
  onChange,
  enrollments = [],
  placeholder = '-- Choose Student(s) --',
  className = '',
  required = false,
  multiple = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Normalize selected IDs
  const selectedIds = multiple
    ? Array.isArray(value)
      ? value.map(String)
      : value
      ? [String(value)]
      : []
    : value
    ? [String(value)]
    : [];

  const isAllSelected = enrollments.length > 0 && selectedIds.length === enrollments.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(enrollments.map((e) => e.id));
    }
  };

  const handleToggle = (id) => {
    const strId = String(id);
    if (!multiple) {
      onChange(id);
      setIsOpen(false);
      return;
    }
    if (selectedIds.includes(strId)) {
      onChange(selectedIds.filter((item) => item !== strId));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const singleSelectedStudent = !multiple && selectedIds.length > 0
    ? enrollments.find((e) => String(e.id) === selectedIds[0])
    : null;

  const filtered = enrollments.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.student_name && e.student_name.toLowerCase().includes(q)) ||
      (e.email && e.email.toLowerCase().includes(q)) ||
      (e.course_name && e.course_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 sm:py-3 bg-gray-50 border rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
          isOpen
            ? 'border-[#166534] ring-2 ring-[#166534]/15 bg-white'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="min-w-0 flex-1 pr-2">
          {multiple ? (
            isAllSelected ? (
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-[#166534] text-xs sm:text-sm bg-green-50 px-2 py-0.5 rounded truncate">
                  🌟 All Students Selected ({enrollments.length})
                </span>
              </div>
            ) : selectedIds.length === 0 ? (
              <span className="text-gray-400 text-xs sm:text-sm">{placeholder}</span>
            ) : selectedIds.length === 1 ? (
              (() => {
                const one = enrollments.find((e) => String(e.id) === selectedIds[0]);
                return one ? (
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                      {one.student_name}
                    </span>
                    <span className="text-[11px] text-gray-500 truncate hidden sm:inline">
                      ({one.email})
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-[#166534] text-xs sm:text-sm">1 Student Selected</span>
                );
              })()
            ) : (
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-[#166534] text-xs sm:text-sm bg-green-50 px-2.5 py-0.5 rounded-lg shrink-0">
                  {selectedIds.length} Students Selected
                </span>
                <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                  (Click to change selection)
                </span>
              </div>
            )
          ) : singleSelectedStudent ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                {singleSelectedStudent.student_name}
              </span>
              <span className="text-[11px] text-gray-500 truncate hidden sm:inline">
                ({singleSelectedStudent.email})
              </span>
              {singleSelectedStudent.course_name && (
                <span className="text-[10px] bg-green-50 text-[#166534] font-semibold px-2 py-0.5 rounded shrink-0 hidden md:inline truncate max-w-[120px]">
                  {singleSelectedStudent.course_name}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-xs sm:text-sm">{placeholder}</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#166534]' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Hidden input for form validation if required */}
      {required && (
        <input
          type="text"
          value={selectedIds.length > 0 ? 'valid' : ''}
          onChange={() => {}}
          required
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Searchable Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in w-full max-w-full">
          {/* Search Box */}
          <div className="p-2.5 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, or course..."
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                autoFocus
              />
              <svg
                className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Multi-Select Action Bar */}
          {multiple && (
            <div className="px-3 py-2 bg-gray-50/90 border-b border-gray-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={toggleSelectAll}
                className={`font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isAllSelected ? 'text-amber-700 hover:text-amber-800' : 'text-[#166534] hover:bg-green-50 px-2 py-0.5 rounded'
                }`}
              >
                <span>{isAllSelected ? '✕ Deselect All' : `✓ Select All (${enrollments.length})`}</span>
              </button>
              {selectedIds.length > 0 && !isAllSelected && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-red-500 hover:text-red-700 font-semibold cursor-pointer px-2 py-0.5"
                >
                  Clear ({selectedIds.length})
                </button>
              )}
            </div>
          )}

          {/* Student Options List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
            {/* Special 'Select All' Item if in multiple mode */}
            {multiple && !search && (
              <div
                onClick={toggleSelectAll}
                className={`p-3 cursor-pointer transition-colors flex items-center justify-between gap-2.5 border-b border-gray-100 ${
                  isAllSelected ? 'bg-green-50/80 text-[#166534]' : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-xs ${
                      isAllSelected
                        ? 'bg-[#166534] text-white font-bold'
                        : 'border border-gray-300 bg-white'
                    }`}
                  >
                    {isAllSelected ? '✓' : ''}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      <span>🌟 All Students (Broadcast)</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Send to all {enrollments.length} enrolled students
                    </div>
                  </div>
                </div>
                {isAllSelected && (
                  <span className="text-[#166534] font-bold text-xs shrink-0">Selected</span>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">
                No matching students found
              </div>
            ) : (
              filtered.map((student) => {
                const isSelected = selectedIds.includes(String(student.id));
                return (
                  <div
                    key={student.id}
                    onClick={() => handleToggle(student.id)}
                    className={`p-3 cursor-pointer transition-colors flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-green-50/70 text-[#166534]'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {multiple && (
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-xs transition-colors ${
                            isSelected
                              ? 'bg-[#166534] text-white font-bold'
                              : 'border border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected ? '✓' : ''}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-gray-800 truncate">
                            {student.student_name}
                          </span>
                          {student.course_name && (
                            <span className="text-[10px] bg-green-100/70 text-[#166534] font-bold px-1.5 py-0.5 rounded truncate shrink-0 max-w-[130px]">
                              {student.course_name}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate mt-0.5">
                          {student.email}
                        </div>
                      </div>
                    </div>
                    {isSelected && !multiple && (
                      <span className="text-[#166534] font-bold text-xs shrink-0">✓</span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Bar for Multi-select */}
          {multiple && (
            <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-semibold">
                {selectedIds.length} of {enrollments.length} selected
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-[#166534] text-white rounded-lg text-xs font-bold hover:bg-green-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

