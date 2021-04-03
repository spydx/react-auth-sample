import { 
   Container,
   Avatar,
   Button,
   TextField,
   Paper,
   makeStyles,
   CssBaseline,
   Typography
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { useForm} from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { loginSuccess } from '../state/reducers/Auth';

type LoginProps = {
   username: string
   password: string
}


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

export const SignIn = () => {
   const classes = useStyles();
   const { register, handleSubmit } = useForm<LoginProps>();
   const dispatch = useDispatch();

   
   const onSubmit = async (login: LoginProps) => {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(login)
      })

      const data = await response.json()
      
      if(data?.token) {
         dispatch(loginSuccess(data.token));
      }
   }



   return(
      <Container component="main" maxWidth="xs">
         
         <CssBaseline />
         <Paper className={classes.paper}>
         <div className={classes.paper}>
            <Avatar className={classes.avatar}>
               <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
               Sign In
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
               <TextField 
                  margin="normal"
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Email address"
                  autoComplete="email"
                  autoFocus
                  inputRef={register({required: "Must have email field"})}
                  />
               <TextField 
                  variant="outlined"
                  fullWidth
                  required
                  id="password" 
                  type="password"
                  name="password"
                  label="Password"
                  inputRef={register({required: "Must have password field"})}
                  />
               <Button 
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
               >Sign in</Button>
            </form>
         </div>
         </Paper>
      </Container>
   );
}