import ProgressBar from 'react-bootstrap/ProgressBar';

function ASNprogressBar(props) {
  return (
    <div>
      <ProgressBar striped variant="info" now={props.progress} />
    </div>
  );
}

export default ASNprogressBar;