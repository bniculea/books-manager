import React, { useState } from 'react';
import Select, {MultiValue} from 'react-select';
import {BookFilters} from "./Search.tsx";

type FilterKey = 'genres' | 'collections' | 'languages';

interface FilterSelectProps {
    availableOptions: Array<string>
    filters: BookFilters;
    placeholder: string;
    onFilterChange: (updatedFilters: BookFilters) => void;
    filterOptionProp: FilterKey;
}


export default function FilterSelect(props: FilterSelectProps) {
    const {availableOptions, placeholder, filters, onFilterChange, filterOptionProp} = props;
    const currentValues = filters[filterOptionProp];

    const [inputValue, setInputValue] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleInputChange = (newValue: React.SetStateAction<string>, actionMeta: { action: string; }) => {
        if (actionMeta.action === 'input-blur') {
            setInputValue(newValue)
        }
    }

    const handleOnChange = (selected: MultiValue<{
        value: string;
        label: string;
    }>) => {
        onFilterChange({
            ...filters,
            [filterOptionProp]: selected.map((option) => option.value)
        })
    }

    return (
        <Select
            isMulti
            options={availableOptions.map(option => ({value: option, label: option}))}
            value={currentValues.map(option => ({value: option, label: option}))}
            onChange={handleOnChange}
            placeholder={placeholder}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
            menuIsOpen={isMenuOpen}
        />
    )
}