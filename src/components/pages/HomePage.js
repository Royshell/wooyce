import React, { Component, useLayoutEffect, useState  } from 'react';
import { withRouter } from 'react-router';
import { ReactMic } from '@cleandersonlobo/react-mic';
import { login, sendFile, getGraphData, setSession } from '../../services/WooyceAPI';
import CanvasJSReact from '../pages/assets/canvasjs.react';
import jsPDF from 'jspdf';

let chartOne;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class HomePage extends Component {

  state = {
    record: false,
    graphData: [],
    options: undefined,
    chart: '',
    isLoading: false,
    radioChecked: false,
    isOpenQuestionsCatalogue: false,
    userData: {},
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
    const wavFile = new File([recordedBlob.blob], 'record.wav', {type: 'audio/wav; codecs=MS_PCM', lastModified: Date.now()});

    try {
      this.setState({ isLoading: true });
      await sendFile(wavFile);    
      this.setState({ isLoading: false });
      const grpahDatas = await getGraphData();  

      const graphInfo = grpahDatas[grpahDatas.length - 1].harmony;
      const sortedGraph = [];
      graphInfo.sort((a,b) => b.strength - a.strength);   
      const EValue = { tune: 'e', strength: 0};
      const DisValue = { tune: 'd#', strength: 0};
      const HValue = { tune: 'h', strength: 0 }     
      graphInfo.map( ({tune, strength}, index) => {
        if (tune === 'e') {
          EValue.strength = strength;
          graphInfo.splice(index, 1);
        } 
        if (tune === 'd#') {
          DisValue.strength = strength;
          graphInfo.splice(index, 1);
        } 
        if (tune === 'h') {
          HValue.strength = strength;
          graphInfo.splice(index, 1);
        }
      });

      graphInfo.forEach(( graphData, index ) => { 
        
        index % 2 === 0 ? sortedGraph.push({...graphData}) : sortedGraph.unshift({...graphData});
      });
      sortedGraph.unshift(EValue);
      sortedGraph.push(DisValue, HValue);
      this.setState({ options: this.getOptions(sortedGraph)});
      
    } catch(err) {
      this.setState({ isLoading: false });
      console.log(err);
    }
  };
  componentDidMount = () => {
    login();
  };
  componentWillMount = () => {
    window.addEventListener('resize', this.handleResize);
  };
  componentDidUpdate = () => {
    if (chartOne) {
      chartOne.set("dataPointWidth",Math.ceil(chartOne.axisX[0].bounds.width/chartOne.data[0].dataPoints.length),true);
    }
  }
  handleResize = () => {
    chartOne.set("dataPointWidth",Math.ceil(chartOne.axisX[0].bounds.width/chartOne.data[0].dataPoints.length),true);
  };
  handleRadioBoxClick = (e) => {
    if(this.state.radioChecked) {
      e.target.checked = !e.target.checked;
      this.setState( { radioChecked: false });
    } else {
      this.setState( { radioChecked: true });
    }
  };
  handleCatalogueToggle = () => {
    this.setState({ isOpenQuestionsCatalogue: !this.state.isOpenQuestionsCatalogue });
  };
  getOptions = (dataInfo) => {
    const dataPoints = dataInfo.map( ({tune, strength}) => {return { label: tune, y: strength} } );
    const data = [];
    const dataObject = {
      type: "column", 
      indexLabel: "{y}%",
      toolTipContent: "{y}%",
      dataPoints
    };
    data.push(dataObject);
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      height: 270,
      axisY:{
        valueFormatString:"0'%'"
      },
      title:{
        text: "Voice Analysis"
      },
      data
    };

    return options;
  };
  exportToPdf = () => {
    const canvas = document.querySelector('.canvasjs-chart-canvas');
    let imgData = canvas.toDataURL("image/jpeg", 1.0);
    let pdf = new jsPDF('landscape', 'cm', 'a4');
  
    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save("download.pdf");
  };
  onUserFirstNameChange = (e) =>{
    const firstName = { firstName: e.target.value };
    this.setState({ userData: {...this.state.userData, ...firstName}})
  };
  onUserLastNameChange = (e) =>{
    const lastName = { lastName: e.target.value };
    this.setState({ userData: {...this.state.userData, ...lastName }});
  };
  onUserEMailChange = (e) =>{
    const email = { email: e.target.value };
    this.setState({ userData: {...this.state.userData, ...email }});
  };
  handleSubmit = () => {
    //this.state.userData - the user data object
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
        backgroundColor="#3F51B5" />
      <div className="btn-wrapper">
        <button onClick={this.startRecording} type="button"></button>
        <button onClick={this.stopRecording} type="button"></button>
      </div>  

      <button className="waves-effect waves-light btn" onClick={this.handleCatalogueToggle}>
        { this.state.isOpenQuestionsCatalogue ? 'Close Questions Catalogue' : 'Open Questions Catalogue'} 
      </button>
      <form>
        <div>
          <input type="text" onChange={ this.onUserFirstNameChange } placeholder="First Name"/>
       </div>
        <div>
          <input type="text" onChange={ this.onUserLastNameChange } placeholder="Last Name"/>
        </div>
        <div>
          <input type="email" onChange={ this.onUserEMailChange } placeholder="E-Mail"/>
        </div>
        <button onClick={ this.handleSubmit }>submit</button>
      </form>
      { this.state.isOpenQuestionsCatalogue && <div className="question-catalogue">  
        <table className="tftable" border="1">
          <tr><th></th><th></th><th>G</th><th>Gis</th><th>A</th><th>B</th><th>H</th><th>C</th><th>Cis</th><th>D</th><th>Dis</th><th>E</th><th>F</th><th>Fis</th></tr>
          <tr><td><strong>Aufwärmrunde:</strong></td> <td> Damit ich mein Gerät einstellen kann, erzählen Sie bitte irgendetwas, z.B. was Sie heute gemacht haben?</td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td><strong>Vorname:</strong></td><td></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td><strong>Nachname:</strong></td><td></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td><strong>Beide zusammen:</strong></td><td> (jeweils laut aussprechen lassen)</td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td><strong>Positiv:</strong></td><td>Denken Sie an etwas Positives, etwas, das Ihnen Freude bereitet; und mit dem vor Augen erzählen Sie irgendetwas.</td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td><strong>Nabel:</strong></td><td>Richten Sie Ihr Bewusstsein zum Nabel, halten Sie die positive Grundstimmung und erzählen Sie weiter.</td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td><strong>Herz:</strong></td><td>Richten Sie ihr Bewusstsein zum Herz, halten Sie die positive Grundstimmung und erzählen Sie weiter.</td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td><strong>Stirnmitte:</strong></td><td>Richten Sie Ihr Bewusstsein zur Stirnmitte, halten Sie die positive Grundstimmung und erzählen Sie weiter.</td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td className="radio-wrapper"><input type="radio" onClick={ this.handleRadioBoxClick }/></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
        </table>
      </div> }
      
      { this.state.isOpenQuestionsCatalogue && <div className="table-wrapper">
        <table className="tftable" border="1">
          <tr><th></th><th></th><th></th><th>G</th><th>Gis</th><th>A</th><th>B</th><th>H</th><th>C</th><th>Cis</th><th>D</th><th>Dis</th><th>E</th><th>F</th><th>Fis</th></tr>
          <tr><td><strong>Aufwärmrunde:</strong></td><td></td><td className="radio-wrapper">#</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td></td><td> Damit ich mein Gerät einstellen kann, erzählen Sie bitte irgendetwas, z.B. was Sie heute gemacht haben?</td><td className="radio-wrapper">%</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td></td></tr>
          <tr><td><strong>Vorname:</strong></td><td></td><td className="radio-wrapper">#</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td></td><td></td><td className="radio-wrapper">%</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td></tr>
          <tr><td><strong>Nachname:</strong></td><td></td><td className="radio-wrapper">#</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td></td><td></td><td className="radio-wrapper">%</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td></tr>
          <tr><td><strong>Beide zusammen:</strong></td><td></td><td className="radio-wrapper">#</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td></td><td> (jeweils laut aussprechen lassen)</td><td className="radio-wrapper">%</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td></td></tr>
          <tr><td><strong>Positiv:</strong></td><td></td><td className="radio-wrapper">#</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td></td><td>Denken Sie an etwas Positives, etwas, das Ihnen Freude bereitet; und mit dem vor Augen erzählen Sie irgendetwas.</td><td className="radio-wrapper">%</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td></td></tr>
          <tr><td><strong>Nabel:</strong></td><td></td><td className="radio-wrapper">#</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td></td><td>Richten Sie Ihr Bewusstsein zum Nabel, halten Sie die positive Grundstimmung und erzählen Sie weiter.</td><td className="radio-wrapper">%</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td></td></tr>
          <tr><td><strong>Herz:</strong></td><td></td><td className="radio-wrapper">#</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td></td><td>Richten Sie ihr Bewusstsein zum Herz, halten Sie die positive Grundstimmung und erzählen Sie weiter.</td><td className="radio-wrapper">%</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td></td></tr>
          <tr><td><strong>Stirnmitte:</strong></td><td></td><td className="radio-wrapper">#</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td><button onClick={this.startRecording} className="mini-mic"></button><button onClick={this.stopRecording} className="mini-stop"></button></td></tr>
          <tr><td></td><td>Richten Sie ihr Bewusstsein zum Herz, halten Sie die positive Grundstimmung und erzählen Sie weiter.</td><td className="radio-wrapper">%</td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td className="radio-wrapper"></td><td></td></tr>
        </table>
      </div> }
      { this.state.isLoading && <div className="lds-ring"><div></div></div> }
      { this.state.options && <button className="btn" onClick={ this.exportToPdf }>Export to PDF </button> }
      { this.state.options && <CanvasJSChart options={this.state.options} onRef={ref => chartOne = ref } /> }
          
      </div>
    );
  }
}

export default withRouter(HomePage);
