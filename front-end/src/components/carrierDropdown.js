import { useState } from 'react';

const Dropdown = (props) => {
    const {name, id, onChange} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
  
  const options = [
    'Select',
    'ABF Freight',
    'Active Aero Charter',
    'Air Charter Service Inc',
    'Ait Worldwide Logistics',
    'APL Logistics',
    'Arnold',
    'Artur Express',
    'Auto Express Villagon SA DE CV',
    'Auto Transportadora Gensis SA DE CV',
    'Barnes Transportation',
    'Barr Nunn Transportation',
    'Bison Transport',
    'BNSF Logistics',
    'Bolt Express',
    'Bolus Freight Systems',
    'Bryan Truck Line',
    'Buchanan Hauling',
    'C.A.T. Inc',
    'Canadian National Railway',
    'Cantu Logistics',
    'Cecilia Serrano Arreguin',
    'Celadon Trucking',
    'Celtic International',
    'Century Dedicated',
    'CEVA Logistics',
    'CEVE Logistics',
    'CH Robinson Worldwide',
    'Challenger Motor Freight',
    'Cheeseman',
    'Circle 8 Logistics',
    'Circle Logistics',
    'Circle T',
    'CN Supply Chain Solutions',
    'Contract Freighters',
    'Conway Freight CFI4',
    'Conway Freight CNWY',
    'Cornerstone Systems',
    'Corporate Traffic',
    'Cowan Systems',
    'Coyote Logistics',
    'Crane Cartage',
    'Crete Carriers',
    'CRST Expedited',
    'D.M. Bowman, Inc.',
    'Dana Transportation',
    'Dart',
    'Dayton Freight',
    'DCM Transport',
    'Dedicated Logistics',
    'Dhl Freight / Standard Forwarding',
    'Dino Trucking',
    'DMT Services',
    'Don Hummer',
    'Echo Global Logistics',
    'Edward Transfer',
    'ESS Delivery Service',
    'Estes Express Lines',
    'Europartners Mexico SA DE CV',
    'Expedited Freight Systems',
    'Express 1',
    'Express 57 SA DE CV',
    'Express Line',
    'Express Tres Fronteras SA DE CV',
    'Exxact Express',
    'FedEx',
    'FedEX Custom Critical',
    'FedEx Freight FXFE',
    'FedEx Freight FXNL',
    'FLS Transport',
    'Frontier Transport',
    'Fuchs Lubricants Co',
    'Fuel Transport',
    'G&D Intergrated Transportation',
    'Garner Transportation',
    'Green Tree Transportation',
    'Grupo Logistico Y Comercializacion Alfa SA DE CV',
    'Halvor Lines',
    'Heartland',
    'Hogan Transport',
    'Holland Motor Freight',
    'Hub Group HCIL',
    'Hub Group HUBG',
    'Hyway Trucking Company',
    'IHR Logistics Transport',
    'Indiana Logistics',
    'Intermodal Sales Corp',
    'Interstate Distributor',
    'J&R Schugel Trucking',
    'Jacobson Transportation',
    'Jaguar',
    'JB Hunt HJBI',
    'JB Hunt HJBT',
    'JMS Transportation',
    'JNJ Express',
    'Kindersley',
    'Knight Transportation',
    'Landstar Ranger',
    'LCG Logistics',
    'Load One',
    'LV Trucking',
    'M&W Transportation Company',
    'Mach1',
    'Matson Logistics',
    'Mesilla Valley Transportation',
    'Metro Expedite',
    'Midwest Third Party Logistics',
    'Milan Express',
    'Miller Transfer',
    'Moblie Track SA DE CV',
    'Mode Transportation',
    'Napa Transportation',
    'National Freight',
    'New Penn',
    'NFI Logistics',
    'Nolan Transportation Group',
    'Ohio Logistics',
    'Other',
    'Pacer Global Logistics PGLI',
    'Pacer Global Logistics PGPR',
    'Palogix Supply Chain Services',
    'PAM Transport',
    'Panther Expedited Services',
    'Paper Transport',
    'Paschall Truck Line Inc',
    'Penske Brokerage Group',
    'Penske Indiana-Whirlpool',
    'Penske La Vergne-Whirlpool',
    'Penske Logistica SA DE CV',
    'Penske Ohio Fleet-Whirlpool',
    'Penske Solon-Cardinal',
    'Penske Tulsa-Whirlpool',
    'Precision Strip',
    'Pride Transportation',
    'Progressive Transportation',
    'R&L Carriers',
    'Rapid Response',
    'RC Express SA DE CV',
    'Ready Trucking',
    'Reddaway',
    'Rich Transport LLC',
    'RoadStar Trucking',
    'Roadway',
    'Roehl Transport',
    'Saddle Creek Transportation',
    'SAIA',
    'Schneider',
    'Schneider Amana Fleet',
    'Sega Carriers',
    'Servicios De Logistica Y Expeditados',
    'SLH Transport',
    'Smith Transport',
    'Southeastern Freight Lines',
    'Spader Freight Services',
    'Spirit Truck Lines',
    'Stan Koch & Sons',
    'STS Transport',
    'Summit Expedited Logistics',
    'Summitt',
    'Sun Express',
    'Swift Transportation Comp',
    'Taylor Express',
    'Tazmanian Freight Forwarding',
    'Tennant Truck Lines',
    'Tennessee Express',
    'Thompson Emergency Freight System',
    'Total Distribution Inc',
    'Total Quality Logistics',
    'TransChem Services',
    'Transplace Mexico',
    'Transport Corp of America',
    'Transportation One',
    'Transporte Internacional Jonick Lopez SA DE CV',
    'Transportes De Carga Fema SA DE CV',
    'Transportes Del Centro',
    'Transportes Mon Ro SA DE CV',
    'Transportes Montoya Sanchez S DE RL DE CV',
    'Transportes Navi SA DE CV',
    'Transportes Posadas',
    'Transpro Freight Systems',
    'Transrapidos',
    'Transx',
    'Tri State Expedited Service',
    'Trucks for You',
    'Uber Freight',
    'United Supply Chain Solutions DE RL DE CV',
    'United Traffic Services',
    'US XPRESS',
    'US XPRESS Dedicated Fleet',
    'USA Trucking',
    'V3 Transportation',
    'Venture Logistics',
    'Veriha Trucking',
    'Volition Logistics de Mexico DE RL DE CV',
    'Werner Enterprises',
    'Western Express',
    'Westside Transport',
    'Whiteford Express',
    'Woodfield',
    'XPO Logistics',
    'XTL Transportation',
  ];
  

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(filter.toLowerCase())
  );

  const handleOptionClick = (selectedOption) => {
    onChange({ target: { name, value: selectedOption } });
    setFilter(selectedOption);
    setIsOpen(false); // Close the dropdown after selecting an option
  };

  const handleInputChange = (event) => {
    setFilter(event.target.value);
    setIsOpen(true); // Open the dropdown when typing
  };

  return (
    <div style={{position:"relative"}}>
      <input
        type="text"
        value={filter}
        id={id}
        name={name} 
        onChange={handleInputChange}
      />
      {isOpen && (
        <div className='dropdown'>
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
