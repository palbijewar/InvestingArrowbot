import React from 'react';
import { EditProfileForm } from 'enl-components';
import useStyles from 'enl-components/Forms/user-jss';

function EditProfilePage() {
  const { classes } = useStyles();

  return (
    <div className={classes.rootFull}>
      <div className={classes.sideFormWrap}>
        <EditProfileForm link="/edit-profile" />
      </div>
    </div>
  );
}

export default EditProfilePage;
