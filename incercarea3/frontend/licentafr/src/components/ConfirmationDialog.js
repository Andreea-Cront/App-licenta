// ConfirmationDialog.js
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function ConfirmationDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ești sigur că vrei să te deconectezi din cont?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deconectarea înseamnă încheierea sesiunii curente.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Nu
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Da
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
