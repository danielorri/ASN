const ShippingForm =(props)=>{
    const {PackingSLipID ,ShippingDate ,DeliveryDate ,CarrierName ,TrackingNo, PlantCode, Customer, ShipTo} = props.shipping;
    
    return(
        <div>
            <h2>Shipping Details</h2>
            <label htmlFor="PackingSLipIDInput">Packing Slip ID</label>
            <input 
            value={PackingSLipID}
            name="PackingSLipID"
            id="PackingSLipIDInput"
            onChange={props.handleChange}
            ></input>
            <label htmlFor="ShippingDateInput">Shipping Date</label>
            <input 
            value={ShippingDate}
            name="ShippingDate"
            id="ShippingDateInput"
            onChange={props.handleChange}
            ></input>
            <label htmlFor="DeliveryDateInput">Delivery Date</label>
            <input 
            value={DeliveryDate}
            name="DeliveryDate"
            id="DeliveryDateInput"
            onChange={props.handleChange}
            ></input>
            <label htmlFor="CarrierNameInput">Carrier Name</label>
            <input 
            value={CarrierName}
            name="CarrierName"
            id="CarrierNameInput"
            onChange={props.handleChange}
            ></input>
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