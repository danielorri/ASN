import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, fetchInventoryConsolidation, fetchInventoryLocked } from '../../app/features/Inventory/inventoryAsyncThunk';
import Select from 'react-select';
import { Tab, Tabs } from 'react-bootstrap';

const Inventory = () => {
    const dispatch = useDispatch();
    const inventory = useSelector((state) => state.inventory.inventory);
    const consolidation = useSelector((state) => state.inventory.consolidation);
    const lockedInventory = useSelector((state) => state.inventory.lockedInventory);
    const inventoryStatus = useSelector((state) => state.inventory.inventoryStatus);
    const consolidationStatus = useSelector((state) => state.inventory.consolidationStatus);
    const lockedInventoryStatus = useSelector((state) => state.inventory.lockedInventoryStatus);
    const error = useSelector((state) => state.inventory.error);
    const [activeTab, setActiveTab] = useState('inventory');
    const [inventoryFilters, setInventoryFilters] = useState({
        ItemCode: '',
        Batch: '',
        Warehouse: '',
        Bin: '',
        Quantity: '',
        'Ctn Count': '',
        PackSize: '',
        'Std Ctn Qty': '',
        Zone: '',
        LicensePlate: ''
    });
    const [consolidationFilters, setConsolidationFilters] = useState({
        Bin: '',
        'Ctn Count': '',
        'Item Count': '',
        '# Batches': '',
        Zone: '',
        Spaces: '',
        Status: ''
    });
    const [lockedInventoryFilters, setLockedInventoryFilters] = useState({
        ItemCode: '',
        Quantity: '',
        'Lock Type': '',
        'Customer/Picklist #': '',
        BatchNumber: '',
        Location: ''
    });
    const [selectedIndices, setSelectedIndices] = useState(new Set());

    const handleRowClick = index => {
        setSelectedIndices(currentIndices => {
            const newIndices = new Set(currentIndices);
            if (newIndices.has(index)) {
                newIndices.delete(index);
            } else {
                newIndices.add(index);
            }
            return newIndices;
        });
        console.log(selectedIndices);
    };

    
    useEffect(() => {
        dispatch(fetchInventory());
        dispatch(fetchInventoryConsolidation());
        dispatch(fetchInventoryLocked());
    }, [dispatch]);

    const handleInputChange = (filterKey, value, tab) => {
        const stringValue = value !== null && value !== undefined ? String(value) : '';
        switch (tab) {
            case 'inventory':
                setInventoryFilters((prev) => ({ ...prev, [filterKey]: stringValue }));
                break;
            case 'consolidation':
                setConsolidationFilters((prev) => ({ ...prev, [filterKey]: stringValue }));
                break;
            case 'lockedInventory':
                setLockedInventoryFilters((prev) => ({ ...prev, [filterKey]: stringValue }));
                break;
            default:
                break;
        }
    };

    const applyFilters = () => {
        // Filters are already applied in real-time with handleInputChange, so this function can be used for any additional actions if needed
    };

    const handleKeyPress = (event, tab) => {
        if (event.key === 'Enter') {
            applyFilters();
        }
    };

    const getFilteredData = (data, filters) => {
        return data ? data.filter((part) =>
            Object.entries(filters).every(([key, value]) =>
                value === '' || (part[key] === null ? '' : part[key].toString()).toLowerCase() === value.toLowerCase()
            )
        ) : [];
    };

    const filteredInventory = getFilteredData(inventory, inventoryFilters);
    const filteredConsolidation = getFilteredData(consolidation, consolidationFilters);
    const filteredLockedInventory = getFilteredData(lockedInventory, lockedInventoryFilters);

    if (inventoryStatus === 'loading' || consolidationStatus === 'loading' || lockedInventoryStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-end mb-3">
                <button onClick={applyFilters} className="btn btn-primary">Apply Filters</button>
            </div>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="inventory" title="Inventory">
                    {renderTabContent(filteredInventory, Object.keys(inventoryFilters), 'inventory')}
                </Tab>
                <Tab eventKey="consolidation" title="Consolidation">
                    {renderTabContent(filteredConsolidation, Object.keys(consolidationFilters), 'consolidation')}
                </Tab>
                <Tab eventKey="lockedInventory" title="Locked Inventory">
                    {renderTabContent(filteredLockedInventory, Object.keys(lockedInventoryFilters), 'lockedInventory')}
                </Tab>
            </Tabs>
        </div>

    );

    function renderTabContent(data, filterKeys, tabName) {
        const lockedBatches = lockedInventory ? lockedInventory.map(item => item.BatchNumber) : [];
    const inventoryBins = inventory ? inventory.reduce((acc, item) => {
        if (lockedBatches.includes(item.Batch)) {
            acc[item.Batch] = item.Bin;
        }
        return acc;
    }, {}) : {};
        return (
            <>
                <div className="row">
                    {filterKeys.map((filterKey) => (
                        <div className="col-md-2 mb-3" key={filterKey}>
                            <Select
                                options={data ? [...new Set(data.map((item) => item[filterKey]))]
                                    .map((option) => ({ label: String(option), value: option }))
                                    .sort((a, b) => {
                                        // Convert to numbers if possible, otherwise compare as strings
                                        const aValue = isNaN(a.label) ? a.label : Number(a.label);
                                        const bValue = isNaN(b.label) ? b.label : Number(b.label);
                                        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                                    }) : []}
                                onChange={(selectedOption) => handleInputChange(filterKey, selectedOption ? selectedOption.value : '', tabName)}
                                onKeyDown={(event) => {
                                    handleKeyPress(event, tabName);
                                }}
                                onFocus={() => handleInputChange(filterKey, '', tabName)}
                                placeholder={`Select ${filterKey}`}
                                blurInputOnSelect
                                isClearable
                                filterOption={(option, input) => {
                                    if (option.label === null || option.label === undefined) return false;
                                    return String(option.label).toLowerCase().startsWith(input.toLowerCase());
                                }}
                            />
                        </div>
                    ))}
                </div>
                <table className="table table-striped" >
                    <thead>
                        <tr>
                            {filterKeys.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((part, index) => {
                            const isLockedBatch = tabName === 'inventory' && lockedBatches.includes(part.Batch);
                            const isLockedBin = tabName === 'consolidation' && Object.values(inventoryBins).includes(part.Bin);
                            return (
                                <tr key={index}  onClick={() => handleRowClick(index)} className={selectedIndices.has(index)? 'table-primary' : isLockedBatch || isLockedBin ? 'table-danger' : ''}>
                                    {filterKeys.map((key) => (
                                        <td key={key}>{part[key]}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>
        );
    }
    
    

};

export default Inventory;



