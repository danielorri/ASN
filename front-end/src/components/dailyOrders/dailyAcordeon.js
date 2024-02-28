import Accordion from 'react-bootstrap/Accordion';
import PopoverDaily from './popover';
import TableDaily from './tableDaily';

function AlwaysOpenAcordeon(props) {
  return (
    <Accordion defaultActiveKey={[]} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
            <div className='d-flex' style={{fontSize: `12px`}}>
                <div className='text-small d-flex'>
                    <p className='fw-bold me-4'>{`${props.groupedOrders[0].CardCode} - ${props.groupedOrders[0].ShipToCode}`}</p>
                    <p className='me-4'>{props.groupedOrders[0].CardName}</p>
                    <p className='fw-semibold me-4'>{props.groupedOrders[0].U_SIF_PO_Sample || "N"}</p>
                </div>
                <div className='text-lg d-flex'>
                    <p className='fw-bolder me-4'> Cartons: {props.groupedOrders.reduce((total, order) => total + (+order.Cartons), 0)}</p>
                    <p className='fw-bolder me-4'> Skids: {props.groupedOrders.reduce((total, order) => total + (+order.SKIDS), 0)}</p>
                    <p className='fw-bolder me-4'> Weight: {Math.ceil(props.groupedOrders.reduce((total, order) => total + (+order.Weight), 0))}</p>
                </div>
                <div className='d-flex'>
                    <p className='me-4'>Part: {props.groupedOrders[0].PART}</p>
                    <p className='fw-bolder pb-0 mb-0 '>CARRIER: {props.groupedOrders[0].CARRIER}</p>
                </div>
                
            </div>
        </Accordion.Header>
        <Accordion.Body>
        <div>
            <p className='text-center ps-5'>{props.groupedOrders[0].Address}</p>
            <div className='d-flex justify-content-between'>
                {/* Render the last 8 items as New components */}
                {Object.keys(props.groupedOrders[0]).slice(-8).map((key, index) => (
                <PopoverDaily  key={index} data={props.groupedOrders[0][key]} title={key} />
                ))}
            </div>
            </div>
          <TableDaily gkey={props.gkey} handleCarrierChange={props.handleCarrierChange} onEditField={props.onEditField} groupedOrders={props.groupedOrders} /> 
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AlwaysOpenAcordeon;