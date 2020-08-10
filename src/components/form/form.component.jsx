import React from 'react';
import { MapFormStandardLayout as MapForm } from './map-form.component';
import { ArrayFormStandardLayout as ArrayForm } from './array-form.component';
import { config, initialValues, arrayConfig, arrayInitialValues } from './dummy';

import './form.styles.scss';


// Form
const Form = () => {

  // Render
  return <div>
    <MapForm
      title="Edit"
      config={config}
      data={initialValues}
      label="Edit"
      onNestedChange={(data) => console.log(data)}
      root
    />
    <ArrayForm
      title="Edit Array"
      config={arrayConfig}
      data={arrayInitialValues}
      onNestedChange={(data) => console.log(data)}
      onItemChange={(...args) => console.log(args)}
      root
    />
  </div>
}

export default Form;