import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ReactMic } from '@cleandersonlobo/react-mic';
import { login, sendFile, getGraphData } from '../../services/WooyceAPI';
import CanvasJSReact from '../pages/assets/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class HomePage extends Component {

  state = {
    record: false,
    graphData: [],
    options: {}
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
    try {
      await sendFile(wavFile);
      const grpahDatas = await getGraphData();
    } catch(err) {
      console.log(err);
    }

    const graphInfo = grpahDatas[grpahDatas.length - 1];
    //this.setState({ graphData: graphInfo });
   this.setState({ options: this.getOptions(graphInfo)});
   console.log(this.state.options);
  };
  componentDidMount = () => {
    login();
  };
  getOptions = (dataInfo) => {
    const dataPoints = dataInfo.map( ({tune, strength}) => {return { label: tune, y: strength} } );
    console.log(dataPoints);
    const data = [];
    const dataObject = {
      type: "column", 
      indexLabelFontColor: "#5A5757",
      indexLabelPlacement: "outside",
      dataPoints
    };
    data.push(dataObject);
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2",
      title:{
        text: "Voice Analysis"
      },
      data
    };

    return options;
  };
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
      { this.state.options && <CanvasJSChart options={this.state.options} /> }
          
      </div>
    );
  }
}

export default withRouter(HomePage);
