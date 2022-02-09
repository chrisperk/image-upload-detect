import Modal from 'react-bootstrap/Modal'
import Image from 'react-bootstrap/Image'

export const ImageModal = props => (
    <Modal show={props.show} onHide={props.handleCloseModal}>
        <Modal.Header closeButton>
            {props.retrievedImage && <Modal.Title>{props.retrievedImage.filename}</Modal.Title>}
        </Modal.Header>

        {props.retrievedImage ? <Image ref={props.imageModalRef}></Image> : <Modal.Body>Loading</Modal.Body>}

        {props.retrievedImage && props.retrievedImage.objectsDetected && <Modal.Body>Objects Detected: {props.retrievedImage.objectsDetected.join(', ')}</Modal.Body>}
    </Modal>
)