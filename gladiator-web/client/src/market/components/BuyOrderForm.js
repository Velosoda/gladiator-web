import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import React, { useState } from 'react';
import { Container, Button, Col, Row, ButtonGroup } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

import { v4 as uuidv4 } from 'uuid';


const initialValues = {
    conditions: [{ category: '', operation: '', value: '' }],
};

// Validation schema for age category
const conditionSchema = Yup.object().shape({
    category: Yup.string().required('Category is required'),
    operation: Yup.string().required('Operation is required'),
    value: Yup.string().required('Value is required'),
    assetType: Yup.string().required('Must select an asset type')
});


const categoryOptions = ['strength', 'age', 'other'];
const logicOperationOptions =
{
    '==': 'Equals',
    '>': 'Greater Than',
    '<': 'Less Than'
}

const ConditionDisplay = ({ conditions, assetType }) => {
    const formatCondition = (condition) => {
        var { category, operation, value } = condition;

        if (operation == "==") {
            operation = ""
        }

        var sentence = {
            category: category || "",
            operation: logicOperationOptions[operation] || "",
            value: value || ""
        }
        return `${sentence.category} ${sentence.operation} ${sentence.value}`
    }

    const conditionText = conditions.map(formatCondition).join(' and ');
    const assetTypeText = assetType ? assetType + " with " : "";
    return (
        <div className="condition-display-container border p-3 mt-3 zindex-1">
            <div style={{ margin: -10 }}>
                <p>{assetTypeText}  {conditionText}</p>
            </div>
        </div>
    )
}

const BuyOrderForm = () => {
    const validationSchemaByCategory = {

    };

    const handleSubmit = (values, { setSubmitting }) => {
        // Your form submission logic here
        console.log('Submitted values:', { orderId: uuidv4(), values });
        setSubmitting(false);

    };
    return (
        <Container className="mt-4 p-4 border rounded shadow-sm bg-light">
            <div className="text-center mb-4">
                <Typography variant="h4" color="textPrimary">
                    Add conditions for your buy order
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" className='text-left'>
                    Each condition you add will be treated as a requirement.
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" className='text-left'>
                    All conditions must be met for the buy order to be valid.
                </Typography>
            </div>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={conditionSchema}>
                {({ values, isSubmitting, touched, errors }) => (
                    <Form>
                        <Row className="mt-3">
                            <Col>
                                <Field
                                    as="select"
                                    name="assetType"
                                    className="form-control"
                                >
                                    <option value="" label="Select Asset Type" />
                                    <option value="Fighter" label="Fighter" />
                                    <option value="" label="Select Asset Type" />
                                    <option value="" label="Select Asset Type" />
                                    <option value="" label="Select Asset Type" />
                                </Field>
                            </Col>
                        </Row>
                        <FieldArray
                            name="conditions"
                            validateOnChange
                            render={({ push, remove }) => (
                                <>
                                    {values.conditions.map((condition, index) => (
                                        <Row key={index} className="condition-container">
                                            <Col md={3}>
                                                <div className="form-group">
                                                    <Field
                                                        as="select"
                                                        name={`conditions[${index}].category`}
                                                        className="form-control"
                                                    >
                                                        <option value="" label="Select A Category" />
                                                        <option value="age" label="Age" />
                                                        <option value="other" label="Other" />
                                                    </Field>
                                                    {errors.category && touched.category ? (
                                                            <ErrorMessage
                                                                name={`conditions[${index}].category`}
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        ) : null
                                                    }
                                                </div>
                                            </Col>

                                            <Col md={3}>
                                                <div className="form-group">
                                                    <Field
                                                        as="select"
                                                        name={`conditions[${index}].operation`}
                                                        className="form-control"
                                                    >
                                                        <option value="" label="Select A Condition" />
                                                        <option value="==" label="Equals" />
                                                        <option value=">" label="Greater Than" />
                                                        <option value="<" label="Less Than" />
                                                    </Field>
                                                    <ErrorMessage
                                                        name={`conditions[${index}].operation`}
                                                        component="div"
                                                        className="text-danger"
                                                    />
                                                </div>
                                            </Col>

                                            <Col md={3}>
                                                <div className="form-group">
                                                    <Field
                                                        type="text"
                                                        name={`conditions[${index}].value`}
                                                        className="form-control"
                                                        placeholder="Enter a value"
                                                    />
                                                    <ErrorMessage
                                                        name={`conditions[${index}].value`}
                                                        component="div"
                                                        className="text-danger"
                                                    />
                                                </div>
                                            </Col>

                                            <Col md={3} className="d-flex flex-column mt-auto">
                                                <div className="form-group mb-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="btn btn-danger"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>
                                    ))}
                                    <div className="form-group">
                                        <button
                                            type="button"
                                            onClick={() => push({ category: '', operation: '', value: '' })}
                                            className="btn btn-primary"
                                        >
                                            Add Condition
                                        </button>
                                    </div>
                                </>
                            )}
                        />
                        <Row className="mt-3">
                            <Col>
                                <ConditionDisplay conditions={values.conditions} assetType={values.assetType} />
                            </Col>
                        </Row>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-success mt-3"
                        >
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export default BuyOrderForm;
// This is the schema we want to use for this,

// CREATE TABLE search_parameters (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     category VARCHAR(255),
//     logic_operation VARCHAR(5),
//     name VARCHAR(255),
//     value VARCHAR(255),
//     order_id INT,
//     FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
//   );
