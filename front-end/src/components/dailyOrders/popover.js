import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

function PopoverDaily(props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  return (
    <div  ref={ref}>
      <Button className='p-1 bg-transparent border-light text-reset' style={{ fontSize: 12}} onClick={handleClick}>{props.title}</Button>

      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref}
        containerPadding={20}
      >
        <Popover id="popover-contained">
          <Popover.Header as="h3">{props.title}</Popover.Header>
          <Popover.Body>{props.data}
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default PopoverDaily;