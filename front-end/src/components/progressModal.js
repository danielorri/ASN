import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ASNprogressBar from './progrssASNbar';

function ProgressCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          ASN Submited
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div
        style={{
          maxHeight: '100px',
          overflowY: 'auto',
          border: '1px solid #ccc',
        }}
      >
        {props.messages.map((text, index) => (
          <p className='text-center pb-0' key={index}>{text}</p>
        ))}
      </div>
        <p className='text-center fw-bold'>{props.serverResponse}</p>
        <ASNprogressBar progress={props.progress} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProgressCenteredModal;
