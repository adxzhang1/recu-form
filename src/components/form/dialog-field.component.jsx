import React from 'react';
import MapFormDialog from './map-form.component';
import ArrayFormDialog from './array-form.component';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DatePicker from './date-picker.component';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Markdown from './markdown.component';


// Transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// DialogField
const DialogField = ({
  config,
  data,
  label,
  handleChange,
  handleNestedChange,
  handleCustomChange,
  error,
  history
}) => {
  const [markdownOpen, setMarkdownOpen] = React.useState(false);

  let labelId; // will store generated label id
  let inputField;

  // Add any classes to field
  let inputFieldClassName = 'form__field-input';
  if (config.type === 'map' || config.type === 'array') {
    inputFieldClassName += ' nested';
  }

  // Create specific component for data type
  switch (config.type) {
    // map
    case 'map':
      inputField = <div className={inputFieldClassName}>
        <MapFormDialog
          title={label}
          label={label}
          data={data || {}}
          config={config}
          onNestedChange={handleNestedChange}
          required={config.validate?.required}
          error={error}
          maxWidth='md'
        />
      </div>
      break;

    // array
    case 'array':
      inputField = <div className={inputFieldClassName}>
        <ArrayFormDialog
          title={label}
          label={label}
          data={data || []}
          config={config}
          onNestedChange={handleNestedChange}
          required={config.validate?.required}
          error={error}
          maxWidth='md'
        />
      </div>
      break;

    // bool
    case 'bool':
      labelId = Math.random().toString(36).substring(2, 15);
      inputField = <div label={label} className={inputFieldClassName}>
        <FormControl variant="outlined" error={error}>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select
            name={label}
            label={label}
            labelId={labelId}
            value={(data !== undefined) ? data : ''}
            onChange={handleChange}
            required={config.validate?.required}
          >
            <MenuItem value={true}>true</MenuItem>
            <MenuItem value={false}>false</MenuItem>
          </Select>
        </FormControl>
      </div>
      break;

    // select
    case 'select':
      labelId = Math.random().toString(36).substring(2, 15);
      inputField = <div label={label} className={inputFieldClassName}>
        <FormControl variant="outlined" error={error}>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select
            name={label}
            label={label}
            labelId={labelId}
            value={data || ''}
            onChange={handleChange}
            required={config.validate?.required}
          >
            {
              config.choices.map((value) => <MenuItem
                key={value}
                label={value}
                value={value}
              >
                {value}
              </MenuItem>)
            }
          </Select>
        </FormControl>
      </div>
      break;

    // date
    case 'date':
      inputField = <div className={inputFieldClassName}>
        <DatePicker
          label={label}
          value={data}
          onChange={handleCustomChange}
          required={config.validate?.required}
          error={error}
        />
      </div>
      break;

    // number
    case 'number':
      inputField = <div className={inputFieldClassName}>
        <TextField
          name={label}
          label={label}
          value={data || ''}
          onChange={handleChange}
          variant="outlined"
          required={config.validate?.required}
          error={error}
          type="number"
        />
      </div>
      break;

    // default (string)
    default:
      // Additional
      let inputClassName = '';
      let formattedLabel = label;
      let additionalActions;

      // Markdown
      if (config.options?.markdown) {
        inputClassName += ' markdown';
        formattedLabel += ' (markdown)';

        if (config.options.viewMarkdown) {
          additionalActions = <React.Fragment>
            <Button
              className="markdown-field__view-button"
              onClick={() => setMarkdownOpen(true)}
              variant="contained"
            >View</Button>
            <Dialog
              open={markdownOpen}
              onClose={() => setMarkdownOpen(false)}
              TransitionComponent={Transition}
              fullScreen
            >
              <div className="markdown-preview">
                <div className="markdown-preview__header">
                  <IconButton className="markdown-preview__close-button" onClick={() => setMarkdownOpen(false)} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                </div>
                <Markdown data={data} />
              </div>
            </Dialog>
          </React.Fragment>
        }
      }

      // Url
      if (config.type === 'url') {
        formattedLabel += ' (url)';
        additionalActions = <Button
          className="url-field__view-button"
          variant="contained"
          onClick={() => {
            if (data && (data.startsWith('http://') || data.startsWith('https://'))) {
              window.open(data || '#', "_blank")
            }
          }}
        >View</Button>
      }

      inputField = <div className={inputFieldClassName}>
        <TextField
          className={inputClassName}
          name={label}
          label={formattedLabel}
          value={data || ''}
          onChange={handleChange}
          required={config.validate?.required}
          error={error}
          variant="outlined"
          fullWidth
          multiline={config.options?.multiline || config.options?.rows}
          rows={config.options?.rows}
          rowsMax={config.options?.rowsMax || 20}
        />
        {
          additionalActions
        }
      </div>
  }

  return <div className="form__field">
    {
      config.options?.message &&
      <div className="form__field-info">
        {config.options.message}
      </div>
    }
    {inputField}
  </div>
}

export default DialogField;