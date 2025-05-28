import React, { useEffect, useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

type Option = {
  label: string;
  value: string; // ONLY string
};

type TagInputProps = {
  label: string;
  required?: boolean;
  error?: string;
  onChange: (selected: Option | Option[] | null) => void;
  value: Option | Option[] | null;
  isMulti?: boolean;
};

const TagInput: React.FC<TagInputProps> = ({
  label,
  required,
  error,
  onChange,
  value,
  isMulti = true,
}) => {
  const [userOptions, setUserOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
        { id: '4', name: 'Dana' },
      ];
      const formatted = users.map((u) => ({ label: u.name, value: u.id }));
      setUserOptions(formatted);
    };

    fetchUsers();
  }, []);

  const handleChange = (
    selected: MultiValue<Option> | SingleValue<Option>
  ) => {
    if (isMulti) {
      onChange(Array.from(selected as MultiValue<Option>));
    } else {
      onChange(selected as SingleValue<Option>);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <Select
        isMulti={isMulti}
        options={userOptions}
        value={value}
        onChange={handleChange}
        placeholder={`Select ${label}`}
      />
      {error && <p className="text-danger mt-1">{error}</p>}
    </div>
  );
};

export default TagInput;
