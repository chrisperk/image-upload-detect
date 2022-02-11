import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {ImageCard} from './ImageCard'

export const ImageRow = props => {
    const renderSwitch = optionSelected => {
        switch(optionSelected) {
            case 'allImagesOption': 
                return (
                    <div>
                        <Button onClick={props.resetRetrievedImagesView}>Back</Button>
                        {props.retrievedImages && props.retrievedImages.map(image => (
                            <ImageCard 
                                key={image.id} 
                                image={image}
                                handleShowModal={props.handleShowModal}>
                            </ImageCard>
                        ))}
                    </div>
                )

            case 'filteredImagesOption':
                return (
                    <div>
                        <Button onClick={props.resetRetrievedImagesView}>Back</Button>
                        {props.filteredImages && props.filteredImages.map(image => (
                            <ImageCard 
                                key={image.id} 
                                image={image}
                                handleShowModal={props.handleShowModal}>
                            </ImageCard>
                        ))}
                    </div>
                )

            default:
                return(
                    <Form>
                        <Form.Group className="mb-3">
                            <Button onClick={props.handleSelectAllImages}>Get All Images</Button>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter filters</Form.Label>
                            <Form.Control onChange={props.handleFiltersInput} type="text" placeholder="Enter a list of filters separated by comma" />
                            <Button onClick={props.handleFiltersSubmit}>Get Filtered Images</Button>
                        </Form.Group>
                    </Form>
                )
        }

    }
    return (
        <Row>
            {renderSwitch(props.retrievedImagesView)}
        </Row>
    )
}