import Card from 'react-bootstrap/Card'

export const ImageCard = props => (
    <Card onClick={() => props.handleShowModal(props.image.id)}>
        <Card.Body>
            <Card.Title>Name: {props.image.filename}</Card.Title>
            <Card.Text>ID: {props.image.id}</Card.Text>
            <Card.Text>Label: {props.image.label}</Card.Text>
            <Card.Text>Object Detection Enabled: {props.image.enableObjectDetection.toString()}</Card.Text>
            {props.image.objectsDetected && <Card.Text>Objects Detected: {props.image.objectsDetected.join(', ')}</Card.Text>}
        </Card.Body>
    </Card>
)