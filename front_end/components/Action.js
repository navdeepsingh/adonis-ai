var React = require('react');
var PropTypes = React.PropTypes;

function Action (props) {
  return (
    <div className="panel panel-info" id="step1-wrapper">
      <div className="panel-heading">
        <h3 className="panel-title">{props.header} - {props.subHeading}</h3>
      </div>
      <div className="panel-body">
          <a href="" onClick={props.onClickButton}><img src="assets/Twitter_Logo_Blue.svg" width="50" height="50" alt="Twitter" /></a>
          <a href="#"><img src="assets/F_icon.svg" width="30" height="30" alt="Facebook" /></a>

          <div className="statusWrapper">
            <hr />
            <p>Connected to Twitter <span className="glyphicon glyphicon-ok" aria-hidden="true"></span></p>
            <p>Connected to Facebook  <span className="glyphicon glyphicon-ok" aria-hidden="true"></span></p>
          </div>
      </div>
    </div>
  )
}

Action.PropTypes = {
  header : PropTypes.string.isRequired,
  subHeading : PropTypes.string.isRequired,
  onClickButton : PropTypes.func.isRequired
}

module.exports = Action
