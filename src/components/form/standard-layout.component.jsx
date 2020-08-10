import React from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import AlertDialog from './alert-dialog.component';


// withStandardLayout
const withStandardLayout = (WrappedComponent) => {

  // Wrapper
  const StandardLayout = ({ title, onNestedChange, root, ...otherProps }) => {
    const childRef = React.useRef();

    const [alert, setAlert] = React.useState({
      open: false,
      message: ''
    });
    const [confirm, setConfirm] = React.useState(false);
    const [responseData, setResponseData] = React.useState(null);

    // Handle save button pressed
    const handleSave = async () => {
      const { response, data } = await childRef.current.retrieve();

      // Check if validation succeeded
      if (response.valid) {
        // Only display confirm dialog if root
        if (!root) {
          onNestedChange(data);
          return;
        }
        setResponseData(data);
        setConfirm(true);

      } else {
        setAlert({
          open: true,
          message: `Invalid: ${response.error.message}`
        })
      }
    }

    // Handle close alert 
    const handleCloseAlert = () => {
      setAlert({
        ...alert,
        open: false,
      });
    }

    // Handle submit button pressed
    const handleSubmit = () => {
      setConfirm(false);
      onNestedChange(responseData);
    }

    // Handle cancel submit
    const handleCancelSubmit = () => setConfirm(false);

    // Render
    return <div className="standard-layout">
      <div className="standard-layout__header">
        {
          title && <div>{title}</div>
        }
        <div className="standard-layout__actions">
          <Button onClick={handleSave} variant="outlined" startIcon={<SaveIcon />}>
            Save
          </Button>
        </div>
      </div>
      <div className="standard-layout__content">
        <WrappedComponent ref={childRef} {...otherProps} />
      </div>
      <AlertDialog open={alert.open} handleClose={handleCloseAlert} message={alert.message} />
      {
        root &&
        <AlertDialog open={confirm} confirmText="Submit" handleClose={handleSubmit} handleCancel={handleCancelSubmit} message={'Are you sure you want to commit changes?'} />
      }
    </div>
  }

  return StandardLayout;
}

export default withStandardLayout;