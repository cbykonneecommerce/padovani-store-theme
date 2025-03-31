import React, { createContext, useContext, useState } from 'react';

export const FilterContext = createContext();

export default function FilterProvider({ children }) {
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    return (
        <FilterContext.Provider
            value={{
                filterIsOpen,
                setFilterIsOpen
            }}>
            {children}
        </FilterContext.Provider>
    )
}
export function useFilter() {
    const context = useContext(FilterContext);
    const { filterIsOpen, setFilterIsOpen } = context;
    return { filterIsOpen, setFilterIsOpen };
}