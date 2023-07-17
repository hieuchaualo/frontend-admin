import { Button, Image, OverlayTrigger, Tooltip } from 'react-bootstrap'


function ButtonImg({ imgUrl, title, tooltip, onClick, className, size = 26, fontSize = 14 }) {
  return (
    <OverlayTrigger
      placement="bottom"
      delayShow={300}
      delayHide={150}
      overlay={
        tooltip
          ?
          <Tooltip id={title}>
            {tooltip}
          </Tooltip>
          : <></>
      }
    >
      {({ triggerHandler }) => (
        <Button
          {...triggerHandler}
          variant="light"
          className={`d-inline-flex align-items-center py-0 ps-0 border-0 shadow-sm shadow-hover background-color-none-hover ${className}`}
          onClick={onClick}
        >
          <Image
            src={imgUrl}
            height={size}
            style={{
              borderRadius: 'var(--bs-border-radius-sm) 0 0 var(--bs-border-radius-sm)'
            }}
          />
          <span className="ms-2 fw-bold text-third" style={{ fontSize: fontSize }}>{title}</span>
        </Button>
      )}
    </OverlayTrigger>
  );
}

export { ButtonImg }