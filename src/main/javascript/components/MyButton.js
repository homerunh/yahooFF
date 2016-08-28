import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Button } from 'react-buttons';

export default class MyButton extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  static propTypes = {
    icon: PropTypes.string,
    message: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    icon: 'plus',
    onClick: null,
    message: '',
  }

  render() {
    const { onClick, icon, message } = this.props;

    return (
      <Button faIcon={icon} className="btn btn-primary" iconBefore={true} onClick={onClick} >
        {message}
      </Button>
    );
  }
}
