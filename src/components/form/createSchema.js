import * as yup from 'yup';
import { config, initialValues } from './dummy';


// General create schema interface
export function createSchema(config) {
  if ('type' in config) {
    return createFieldSchema(config);
  }

  let schemaShape = {};
  Object.keys(config).forEach((field) => {
    schemaShape[field] = createFieldSchema(config[field]);
  })
  return yup.object().shape(schemaShape);
}

// Create schema for a specific object
export function createFieldSchema(config) {
  let schema;

  // Create specific schema for data type
  switch (config.type) {
    case 'array':
      schema = yup.array().of(createFieldSchema(config.nested));
      break;
    case 'map':
      let schemaShape = {};
      Object.keys(config.nested).forEach((field) => {
        schemaShape[field] = createFieldSchema(config.nested[field]);
      });
      schema = yup.object().shape(schemaShape);
      break;
    case 'select':
      // eslint-disable-next-line no-template-curly-in-string
      schema = yup.mixed().test('isValidChoice', '${path} has an invalid choice.', (value) => config.choices.includes(value));
      break;
    case 'bool':
      schema = yup.boolean();
      break;
    case 'date':
      schema = yup.date();
      break;
    case 'number':
      schema = yup.number().nullable();
      break;
    default:
      schema = yup.string();
  }

  // Add additional checks
  if (config.validate?.required) {
    schema = schema.required();
  }

  return schema;
}

// Tests
export const test = () => {
  const schema = createSchema(config.nested.food);
  console.log('test:', schema)
  schema.validate(initialValues.food)
    .then((res) => console.log(res))
    .catch((err) => console.log('Error:', err));
}

export default createSchema;