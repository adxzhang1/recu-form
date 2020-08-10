# Recu-Form

Infinitely nested forms built from javascript objects. Uses material-ui, yup for validation, and react-sortable-hoc + react-virtualized for list forms.

MapForm component allows you to create a form in the format of a map.

ArrayForm component allows you to create a form in the format of an array.

## Setup

Basic config is an object in the format:
```
var config = {
  type: 'map' | 'array' | 'string' | 'bool' | 'number' | 'date' | 'select' | 'url';
  nested?: {...}; // an object to represent the map or an item in the array, only for 'map' and 'array'
  choics?: [] // choices to select, only for 'select';
  validate?: {
    required?: boolean;
  }
  options?: {
    message?:
    multiline?: boolean; // only if 'string'
    rows?: number; // specify height of input, only if multiline
    rowsMax?: number; // specify max height of input, only if multiline
    markdown?: boolean; // only if 'string'
    viewMarkdown?: boolean; // adds a toggleable dialog to view markdown, only if markdown
  }
}
```


## Example

```
import React from 'react';
import { MapFormStandardLayout as MapForm } from './map-form.component';
import { ArrayFormStandardLayout as ArrayForm } from './array-form.component';

const Form = () => {
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
```