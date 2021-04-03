
import logo from '../logo.svg';
import { 
   Container,
   Paper,
   Button,
   makeStyles,
   Typography
 } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { logout } from '../state/reducers/Auth';
import { useForm} from 'react-hook-form';
import '../App.css';

const useStyles = makeStyles((theme) => ({
   paper: {
     marginTop: theme.spacing(8),
     marginLeft: theme.spacing(1),
     marginRight: theme.spacing(1),
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center'
   },
   avatar: {
     margin: theme.spacing(1),
     backgroundColor: theme.palette.secondary.main,
   },
   form: { 
     width: '100%',
     marginTop: theme.spacing(1)
   },
   submit: {
     margin: theme.spacing(3,0,2),
   }
 
}));

export const ReactLogo = () => {
   const {handleSubmit} = useForm();
   const classes = useStyles();

   const dispatch = useDispatch();
  
   const onSubmit = () => {
      dispatch(logout(true));
   }

   return (
     <Container component="main" maxWidth="xs">
       <Paper className={classes.paper}>
     <div className={classes.paper}>
         <Typography component="h1" variant="h5">
           Logged in
        </Typography>
     <header className="App-header">
       <img src={logo} className="App-logo" alt="logo" />
       <p>
        
       </p>
       <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Button 
               type="submit"
               fullWidth
               variant="contained"
               color="primary"
               className={classes.submit}
          >
            Logout
          </Button>
       </form>
       
     </header>
   </div>
     </Paper>
   </Container>
   );
 }