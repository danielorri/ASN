import Dropdown from "../components/carrierDropdown";

const ShippingForm =(props)=>{
    const {PackingSLipID ,ShippingDate ,DeliveryDate ,CarrierName ,TrackingNo, PlantCode, Customer, ShipTo} = props.shipping;
   
    const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year.slice(2)}`;
      };

    return(
        <div>
            <h2>Shipping Details</h2>
            <label htmlFor="ShippingDateInput">Shipping Date</label>
            <input
                type="date"
                value={ShippingDate}
                name="ShippingDate"
                id="ShippingDateInput"
                onChange={props.handleChange}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => {
                    e.target.type = 'text';
                    const formattedDate = formatDate(e.target.value);
                    e.target.value = formattedDate;
                    props.handleChange(e);
                }}
            />
            <label htmlFor="DeliveryDateInput">Delivery Date</label>
            <input 
            type="date"
            value={DeliveryDate}
            name="DeliveryDate"
            id="DeliveryDateInput"
            onChange={props.handleChange}
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => {
                e.target.type = 'text';
                const formattedDate = formatDate(e.target.value);
                e.target.value = formattedDate;
                props.handleChange(e);
            }}
            ></input>
             <label htmlFor="PackingSLipIDInput">Packing Slip ID</label>
            <input 
            value={PackingSLipID}
            name="PackingSLipID"
            id="PackingSLipIDInput"
            onChange={props.handleChange}
            ></input>
            <label htmlFor="CarrierNameInput">Carrier Name</label>
            <Dropdown 
            value={CarrierName}
            name="CarrierName"
            id='CarrierNameInput'
            onChange={props.handleChange} />
            <label htmlFor="TrackingNoInput">Tracking No.</label>
            <input 
            value={TrackingNo}
            name="TrackingNo"
            id="TrackingNoInput"
            onChange={props.handleChange}
            ></input>
             <label htmlFor="PlantCodeInput">Plant Code</label>
            <input 
            value={PlantCode}
            name="PlantCode"
            id="PlantCodeInput"
            onChange={props.handleChange}
            ></input>
            <label htmlFor="CustomerInput">Customer</label>
            <input 
            value={Customer}
            name="Customer"
            id="CustomerInput"
            onChange={props.handleChange}
            ></input>
            <label htmlFor="ShipToInput">Ship To</label>
            <input 
            value={ShipTo}
            name="ShipTo"
            id="ShipToInput"
            onChange={props.handleChange}
            ></input>
        </div>
    )
};

export default ShippingForm;