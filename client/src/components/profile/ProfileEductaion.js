import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEductaion = ({
  education: { school, degree, fieldofstudy, from, to, description }
}) => {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{' '}
        {!to ? 'Now' : <Moment format="YYYY/MM/DD">{to}</Moment>}
      </p>
      <p>
        <strong>Degree or Certificate: </strong> {degree}
      </p>
      <p>
        {fieldofstudy && (
          <Fragment>
            <strong>Field of Study: </strong> {fieldofstudy}
          </Fragment>
        )}
      </p>
      <p>
        {description && (
          <Fragment>
            <strong>Description: </strong> {description}
          </Fragment>
        )}
      </p>
    </div>
  );
};

ProfileEductaion.propTypes = {
  education: PropTypes.object.isRequired
};

export default ProfileEductaion;
