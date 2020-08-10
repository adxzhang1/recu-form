import React from 'react';
import DialogField from './dialog-field.component';

import withDialogToggler from './dialog-toggler';
import withDialogLayout from './dialog-layout.component';
import withStandardLayout from './standard-layout.component';

import createSchema from './createSchema';
import _ from 'lodash';


// MapForm
export const MapForm = React.forwardRef(({ config, data }, ref) => {
  const fields = Object.keys(config.nested);

  const [buffer, changeBuffer] = React.useState(_.cloneDeep(data));

  const [error, setError] = React.useState({});

  // Initialize missing data
  React.useEffect(() => {
    const newBuffer = { ...buffer }
    let initialized = false;
    Object.keys(config.nested).forEach((field) => {
      if (buffer[field] === undefined) {
        if (config.nested[field].type === 'date') {
          newBuffer[field] = new Date();
          initialized = true;
          // } else if (config.nested[field].type === 'select') {
          //   newBuffer[field] = config.nested[field].choices[0]
          //   initialized = true;
        } else if (config.nested[field].type === 'array') {
          newBuffer[field] = [];
          initialized = true;
        } else if (config.nested[field].type === 'string') {
          newBuffer[field] = '';
          initialized = true;
        }
      }
    });
    if (initialized) {
      changeBuffer(newBuffer);
    }
  }, [buffer, config.nested]);

  // Ref handle
  React.useImperativeHandle(ref, () => ({
    retrieve: async () => ({
      response: await validate(),
      data: buffer
    })
  }));

  // Handle submitting form
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(buffer);
  }

  // Handle change in field data
  const handleChange = (event) => {
    const { name, value } = event.target;
    changeBuffer({
      ...buffer,
      [name]: value
    });
  }

  // Handle change in field data custom
  const handleCustomChange = (name) => {
    return (value) => {
      changeBuffer({
        ...buffer,
        [name]: value
      });
    }
  }

  // Handle change in field data with nested data
  const handleNestedChange = (name) => {
    return (value) => {
      changeBuffer({
        ...buffer,
        [name]: value
      });
    }
  }

  // Validate form
  const validate = async () => {
    const schema = createSchema(config);
    console.log('config', config, 'validating:', buffer, 'schema:', schema)
    try {
      await schema.validate(buffer);
      setError({});
      return {
        valid: true,
      }
    } catch (err) {
      console.log(err);
      setError({
        [err.path.split('.')[0]]: true
      });
      return {
        valid: false,
        error: err
      };
    }
  }

  // Render
  return <form onSubmit={handleSubmit}>
    {
      fields.map((field) => {
        return <DialogField
          key={field}
          label={field}
          config={config.nested[field]}
          data={buffer[field]}
          handleChange={handleChange}
          handleNestedChange={handleNestedChange(field)}
          handleCustomChange={handleCustomChange(field)}
          error={error[field]}
        />
      })
    }
  </form>
});

// With Standard Layout
export const MapFormStandardLayout = withStandardLayout(MapForm);

// With only dialog layout
export const MapFormDialogLayout = withDialogLayout(MapForm);

// With dialog toggler & layout
export const MapFormDialog = withDialogToggler(withDialogLayout(MapForm));

export default MapFormDialog;