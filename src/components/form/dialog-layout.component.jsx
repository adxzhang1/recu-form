import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaveIcon from '@material-ui/icons/Save';
import AlertDialog from './alert-dialog.component';


// withDialogLayout
const withDialogLayout = (WrappedComponent) => {

  // Wrapper
  const DialogLayout = ({ title, open, handleClose, onNestedChange, maxWidth, root, ...otherProps }) => {
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
          handleClose();
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
      handleClose();
    }

    // Handle cancel submit
    const handleCancelSubmit = () => setConfirm(false);

    // Render
    return <Dialog open={open} className="dialog" fullWidth maxWidth={maxWidth || 'lg'}>
      <div className="dialog__header">
        {
          title && <DialogTitle>{title}</DialogTitle>
        }
        <DialogActions className="dialog__actions">
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="outlined" startIcon={root && <SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </div>
      <DialogContent className="dialog__content">
        <WrappedComponent ref={childRef} {...otherProps} />
      </DialogContent>
      <AlertDialog open={alert.open} handleClose={handleCloseAlert} message={alert.message} />
      {
        root &&
        <AlertDialog open={confirm} confirmText="Submit" handleClose={handleSubmit} handleCancel={handleCancelSubmit} message={'Are you sure you want to commit changes?'} />
      }
    </Dialog>
  }

  return DialogLayout;
}

export default withDialogLayout;