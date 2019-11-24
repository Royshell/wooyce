import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ReactMic } from '@cleandersonlobo/react-mic';
import { login, sendFile, getGraphData } from '../../services/WooyceAPI';
import CanvasJSReact from '../pages/assets/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;


const options = {
  animationEnabled: true,
  exportEnabled: true,
  theme: "light2", //"light1", "dark1", "dark2"
  title:{
    text: "Simple Column Chart with Index Labels"
  },
  data: [{
    type: "column", //change type to bar, line, area, pie, etc
    //indexLabel: "{y}", //Shows y value on all Data Points
    indexLabelFontColor: "#5A5757",
    indexLabelPlacement: "outside",
    dataPoints: [
      { x: 10, y: 71 },
      { x: 20, y: 55 },
      { x: 30, y: 50 },
      { x: 40, y: 65 },
      { x: 50, y: 71 },
      { x: 60, y: 68 },
      { x: 70, y: 38 },
      { x: 80, y: 92, indexLabel: "Highest" },
      { x: 90, y: 54 },
      { x: 100, y: 60 },
      { x: 110, y: 21 },
      { x: 120, y: 49 },
      { x: 130, y: 36 }
    ]
  }]
};
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
    await sendFile(wavFile);
    const grpahDatas = await getGraphData();
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
