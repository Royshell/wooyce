import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ReactMic } from 'react-mic';

class HomePage extends Component {

  state = {
    record: false
  };
  startRecording = () => {
    this.setState({
      record: true
    });
  }
  stopRecording = () => {
    this.setState({
      record: false
    });
  };
  onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
  };
  render() {
    return (
      <div className="widget">
      <ReactMic
        record={this.state.record}
        className="sound-wave"
        onStop={this.onStop}
        onData={this.onData}
        strokeColor="#000000"
        backgroundColor="#FF4081" />
      <button onTouchTap={this.startRecording} type="button">Start</button>
      <button onTouchTap={this.stopRecording} type="button">Stop</button>
      </div>
    );
  }
}

export default withRouter(HomePage);
