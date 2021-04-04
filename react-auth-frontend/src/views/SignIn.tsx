import { 
   Container,
   Avatar,
   Button,
   TextField,
   Paper,
   makeStyles,
   CssBaseline,
   Typography,
   Box
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { useForm} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginError } from '../state/reducers/Auth';
import { registerAccount, showRegisterView} from '../state/reducers/Account';
import { RootState } from '../state/rootReducer';

type LoginProps = {
   username: string
   password: string
}

export type LoggedIn = {
   token: string,
   tokenType: string, 
   profile: string,
}

export type RegisterAccount = {
   name: string,
   email: string,
   password: string,
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
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
   }
 
 }));


export const SignIn = () => {
   const classes = useStyles();
   const { register, handleSubmit } = useForm<LoginProps>();
   const dispatch = useDispatch();
   const account = useSelector((state: RootState) => state.account)
   const auth = useSelector((state: RootState) => state.auth)
   
   const onSubmit = async (login: LoginProps) => {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(login)
      })
      if(response.status !== 200) {
         console.log("triggede");
         dispatch(loginError(true));
         return
      }
      const data = await response.json()
      
      
      if(data?.token) {
         dispatch(loginSuccess(data.token));
      } 
      
      
   }

   const onRegister = async(reg: RegisterAccount ) => {
      const response = await fetch('http://localhost:8080/api/auth/register', {
         method: 'POST',
         headers: { 'Content-type': 'application/json'},
         body: JSON.stringify(reg)
      })
      const data = await response.json()
      if(data?.email && data?.name) { 
         dispatch(registerAccount(reg))
      }
   }

   const showRegistering = () => {
      dispatch(showRegisterView(true))
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
              { account.registered ?  "Sign In" : "Register" }
            </Typography>
            <form className={classes.form} noValidate onSubmit={account.registered ? handleSubmit(onSubmit) : handleSubmit(onRegister)}>
               {account.registered ? null : <TextField 
                  margin="normal"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  inputRef={register({required: "Must have name field"})}
                  /> }
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
               { account.registered ? <Button 
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
               >Sign in</Button> : null }
               { account.registered ? <Button 
                  onClick={() => showRegistering()}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  > Register </Button> : 
                  <Button 
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  > Register </Button>
               }
            </form>
         </div>
         { auth.error ? <Box bgcolor="error.main" p={2}><Typography component="h1" variant="h5" >
              Something went wrong, try again
         </Typography></Box>: null }
         </Paper>
      </Container>
   );
}

