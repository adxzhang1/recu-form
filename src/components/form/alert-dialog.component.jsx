import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


// AlertDialog
const AlertDialog = ({ message, confirmText, open, handleClose, handleCancel }) => {

  // Render
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            handleCancel &&
            <Button onClick={handleCancel} color="primary" autoFocus>
              Cancel
          </Button>
          }
          <Button onClick={handleClose} color="primary" autoFocus>
            {
              confirmText || 'Ok'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;
