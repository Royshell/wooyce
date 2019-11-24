import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ReactMic } from '@cleandersonlobo/react-mic';
import { login, sendFile, getGraphData } from '../../services/WooyceAPI';

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
  onStop = async(recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
    const wavFile = new File([recordedBlob.blob], 'record.wav', {type: 'audio/wav; codecs=MS_PCM', lastModified: Date.now()});
    //const wavFile = recordedBlob.blob;
    await sendFile(wavFile);
    await getGraphData();
  };
  componentDidMount = () => {
    login();
  }
  render() {
    return (
      <div className="widget">
      <ReactMic
        record={this.state.record}
        className="sound-wave"
        onStop={this.onStop}
        onData={this.onData}
        strokeColor="#ffffff"
        backgroundColor="#FF4081" />
      <button onClick={this.startRecording} type="button">Start</button>
      <button onClick={this.stopRecording} type="button">Stop</button>
      </div>
    );
  }
}

export default withRouter(HomePage);
