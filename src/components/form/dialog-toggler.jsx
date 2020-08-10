import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';


// withDialogToggler
export const withDialogToggler = (WrappedComponent) => {

  // Wrapper
  const DialogToggler = ({ label, required, error, ...otherProps }) => {
    const [open, setOpen] = React.useState(false);

    // Handle click open
    const handleClickOpen = () => {
      setOpen(true);
    };

    // Handle close
    const handleClose = () => {
      setOpen(false);
    };

    // Render
    return (
      <div className="dialog-toggler">
        <div className="dialog-toggler__interface">
          {
            label &&
            <InputLabel required={required} className="dialog-toggler__label" error={error} >{label}</InputLabel>
          }
          <IconButton variant="outlined" color="primary" onClick={handleClickOpen}>
            <EditIcon />
          </IconButton>
        </div>
        {
          open &&
          <WrappedComponent open={open} handleClose={handleClose} {...otherProps} />
        }
      </div>
    );
  }
  return DialogToggler;
}

export default withDialogToggler;
