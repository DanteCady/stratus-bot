'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const DropdownDataContext = createContext();

export const DropdownDataProvider = ({ children }) => {
    const [dropdownData, setDropdownData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const response = await fetch('/api/system/config');
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setDropdownData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    return (
        <DropdownDataContext.Provider value={{ dropdownData, loading, error }}>
            {children}
        </DropdownDataContext.Provider>
    );
};

export const useDropdownData = () => useContext(DropdownDataContext);
