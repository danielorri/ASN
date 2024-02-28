import Table from 'react-bootstrap/Table';

function TableDaily(props) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr className='fw-normal'>
            <th>DocNum</th>
            <th>Cartons</th>
            <th>SKIDS</th>
            <th>Weight</th>
            <th>Part</th>
            <th>Status</th>
            <th>U_SIF_ShipInst1</th>
            <th>U_SIF_ShipInst2</th> 
        </tr>
      </thead>
      <tbody>
      {props.groupedOrders.map((order, index) => (
        <tr key={order.DocNum}>
            <td>{order.DocNum}</td>
            <td>
            <input
            type='number'
                value={order.Cartons}
                onChange={(e) => props.onEditField(props.gkey, index,'Cartons', e.target.value)}
            />
            </td>
            <td>
            <input
            type='number'
                value={order.SKIDS}
                onChange={(e) => props.onEditField(props.gkey, index,'SKIDS', e.target.value)}
            />
            </td>
            <td>
            <input
            type='number'
                value={order.Weight}
                onChange={(e) => props.onEditField(props.gkey, index, 'Weight', e.target.value)}
            />
            </td>
            <td>{order.PART}</td>
            <td>{order.U_SIF_ShipInst1}</td>
            <td>{order.U_SIF_ShipInst2}</td>
        </tr>
        ))}
        {/* Total row */}
        <tr className='fw-bold'>
        <td>Total</td>
        <td>{props.groupedOrders.reduce((total, order) => total + (+order.Cartons), 0)}</td>
        <td>{props.groupedOrders.reduce((total, order) => total + (+order.SKIDS), 0)}</td>
        <td>{props.groupedOrders.reduce((total, order) => total + (+order.Weight), 0)}</td>
        <td>CARRIER: </td>
        <input
        className='fw-bold border-0'
          value={props.groupedOrders[0].CARRIER}
          onChange={(e) => props.handleCarrierChange(props.gkey, e.target.value)}
        />
        </tr>
      </tbody>
    </Table>
  );
}

export default TableDaily;