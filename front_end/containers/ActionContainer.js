var React = require('react');
var Action = require('../components/Action');
var axios = require('axios');

var ActionContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  handleClickButton : function (e){
    e.preventDefault();
    axios.get('http://localhost:3333/api/connect/twitter')
      .then(function (response) {
        window.location = response.data
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  render : function (){
    return (
      <Action
        header={this.props.route.header}
        subHeading={this.props.route.subHeading}
        onClickButton={this.handleClickButton} />
    )
  }
});

module.exports = ActionContainer;
