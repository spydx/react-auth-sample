import { makeStyles } from '@material-ui/core';
import { apiRoot } from '../services/api';

//justify-content: cente

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  }
}))

export const Footer = () => {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className="text-muted">{apiRoot}</div>   
    </div>
      
  );
 }





