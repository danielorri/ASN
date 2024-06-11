import Dropdown from "../components/carrierDropdown";
import "./shippingForm.css";
const ShippingForm =(props)=>{
    const {PackingSLipID ,ShippingDate ,DeliveryDate ,CarrierName ,TrackingNo, PlantCode, Customer, ShipTo} = props.shipping;
   
    const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year.slice(2)}`;
      };

      const today = props.today;
    return(
        <div className="Form">
            <h2>Shipping Details</h2>
            <div className="shippingForm">
                <div>
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
                    {Customer === '9675' && ShippingDate !== today || Customer === '9676' && ShippingDate !== today || Customer === '10105' && ShippingDate !== today || Customer === '10053' &&
                    ShippingDate !== today || Customer !== '9675' ?
                    <div>
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
                    </div> : ''}
                    {Customer === '9675' && ShippingDate === today || Customer === '9676' && ShippingDate === today || Customer === '10105' && ShippingDate === today || Customer === '10053' &&
                    ShippingDate === today || Customer === '9600' || Customer === '3899' || Customer === '3896' || Customer === '3895' || Customer === '3894' || Customer === ''?
                    <div>
                    <label htmlFor="PackingSLipIDInput">Packing Slip ID</label>
                    <input 
                    value={PackingSLipID}
                    name="PackingSLipID"
                    id="PackingSLipIDInput"
                    onChange={props.handleChange}
                    ></input>
                    </div> : ''}
                    {Customer === '9675'|| Customer === '9676' || Customer === '10105'|| Customer === '10053'? '':
                    <div>
                    <label htmlFor="CarrierNameInput">Carrier Name</label>
                    <Dropdown 
                    value={CarrierName}
                    name="CarrierName"
                    id='CarrierNameInput'
                    onChange={props.handleChange} /> </div>}
                </div>
            <div>
            {Customer === '9675'|| Customer === '9676' || Customer === '10105'|| Customer === '10053'?
                '': <div>
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
                    ></input> </div>}
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
            </div>
            <button onClick={props.handleGetParts} className="getParts">Get Parts</button>
        </div>
    )
};

export default ShippingForm;