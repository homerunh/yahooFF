import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MyButton from'FF/components/MyButton';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  hello() {
    console.log("helo!!");
  }

  render() {
    return (
			<div>
				<h1>  Hello World! OOOOO ! </h1>
        <MyButton className="btn add-btn" onClick={this.hello} message="WOW!"/>
			</div>
		);
  }
}
