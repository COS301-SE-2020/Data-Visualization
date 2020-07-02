import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


function SignUpDialog(props) {

  const [open, setOpen] = React.useState(true);
  
 
  const handleClose = () => {
    props.setpType('dashboard');
  };

  const handleSend = () => {
    //send

    props.setpType('dashboard');
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Sign up</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="name"
            fullWidth
          />
          <TextField
            margin="dense"
            id="sname"
            label="Surname"
            type="name"
            fullWidth
          />
          <TextField
            margin="dense"
            id="uname"
            label="Email Address / Username"
            type="email"
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="Confirm password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSend} color="primary">
            Sign up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function LoginDialog(props) {

 
  const [open, setOpen] = React.useState(true);

  const [signup, setSignUp] = React.useState('false');
 
  const handleClose = () => {
    props.setpType('dashboard');
  };

  const handleSend = () => {
    //send

    props.setNameState('Welcome Byron');
    props.setpType('dashboard');
  };


  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address / Username"
            type="email"
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignUp('true')} color="primary">
            Sign up
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSend} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
      <main>
        {
          signup === 'true' ?
            <SignUpDialog pType= {props.pType}  setpType= {props.setpType}/>
            :
            null
        }
        
      </main>
    </div>
    

  );
}

export default LoginDialog;