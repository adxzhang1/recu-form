import React from 'react';
import DialogField from './dialog-field.component';

import withDialogToggler from './dialog-toggler';
import withDialogLayout from './dialog-layout.component';

import createSchema from './createSchema';
import _ from 'lodash';


// SimpleForm
export const SimpleForm = React.forwardRef(({ config, data }, ref) => {
  const [buffer, changeBuffer] = React.useState(_.cloneDeep(data));

  // Initialize missing data
  React.useEffect(() => {
    let newBuffer;
    let initialized = false;

    if (buffer === undefined) {
      if (config.type === 'date') {
        newBuffer = new Date();
        initialized = true;
        // } else if (config.type === 'select') {
        //   newBuffer = config.choices[0]
        //   initialized = true;
      } else if (config.type === 'string') {
        newBuffer = '';
        initialized = true;
      }
    }
    if (initialized) {
      changeBuffer(newBuffer);
    }
  }, [buffer, config]);

  // Ref handle
  React.useImperativeHandle(ref, () => ({
    retrieve: async () => ({
      response: await validate(),
      data: buffer
    })
  }));

  // Handle submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(buffer);
  }

  // Handle change in value
  const handleChange = (event) => {
    const { value } = event.target;
    changeBuffer(value);
  }

  // Validate form
  const validate = async () => {
    const schema = createSchema(config);
    console.log('config', config, 'validating:', buffer, 'schema:', schema)
    try {
      await schema.validate(buffer);
      return {
        valid: true,
      }
    } catch (err) {
      console.log(err);
      return {
        valid: false,
        error: err
      };
    }
  }

  // Render
  return <form onSubmit={handleSubmit}>
    <DialogField
      label="value"
      config={config}
      data={buffer}
      handleChange={handleChange}
    />
  </form>
});

// With only dialog layout
export const SimpleFormDialogLayout = withDialogLayout(SimpleForm);

// With dialog toggler & layout
const SimpleFormDialog = withDialogToggler(withDialogLayout(SimpleForm));

export default SimpleFormDialog;