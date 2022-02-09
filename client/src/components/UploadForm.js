import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'

export const UploadForm = ({
    viewerRef,
    imageUploadRef,
    handleUploadSubmit,
    handleLabelInput,
    handleObjectDetectionInput,
    postedImage,
}) => (
    <Row>
        {postedImage && <Image ref={viewerRef}></Image>}
        <Form>
            <Form.Group className="mb-3" controlId="formImageUploader">
                <Form.Label>Image Uploader</Form.Label>
                <Form.Control ref={imageUploadRef} type="file"></Form.Control>
                <Form.Text className="text-muted">
                    Submit an image
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Label</Form.Label>
                <Form.Control onChange={handleLabelInput} type="text" placeholder="Optional" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check onChange={handleObjectDetectionInput} type="checkbox" label="Enable object detection" />
            </Form.Group>
            <Button onClick={handleUploadSubmit} variant="primary" type="button">
                Submit
            </Button>
        </Form>
    </Row>
)