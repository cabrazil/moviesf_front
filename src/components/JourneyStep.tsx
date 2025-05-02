import { useState } from 'react';

type JourneyStepProps = {
  question: string;
  options: {
    id: string;
    text: string;
    description?: string;
  }[];
  onSelect: (option: any) => void;
  selectedOption?: any;
};

const JourneyStep = ({ question, options, onSelect, selectedOption }: JourneyStepProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(selectedOption?.id || null);

  const handleOptionClick = (option: any) => {
    setSelectedId(option.id);
    onSelect(option);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 text-center">{question}</h2>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            className={`block w-full p-4 rounded-lg text-left transition-all duration-200 ${
              selectedId === option.id
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-white border border-gray-200 hover:border-blue-300'
            }`}
          >
            <span className="text-lg font-medium text-gray-900">{option.text}</span>
            {option.description && (
              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JourneyStep; 