import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import ProductForm from './dashboard/prodForm';

const ProductsOperations : React.FC<{productType:string}> = ({productType}) => {
  return (

    <Accordion >
      <Accordion.Item eventKey="0">
        <Accordion.Header>Add a product</Accordion.Header>
        <Accordion.Body>
        <ProductForm productType={productType}/>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Modify a product</Accordion.Header>
        <Accordion.Body>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default ProductsOperations;