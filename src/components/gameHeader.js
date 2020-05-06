import React from 'react';
import '../App.css';
import win from '../images/win.png';
import lose from '../images/lose.png';
import go from '../images/go.png';
import mines from '../images/bomb.png';
import width from '../images/width.png';
import height from '../images/height.png';
import flags from '../images/flags.png';


class GameHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {width: 10, height: 10, mines: 10}
        this.gameStatus = this.gameStatus.bind(this);
        this.newGameHeader = this.newGameHeader.bind(this);
        this.gameResultHeader = this.gameResultHeader.bind(this);
        this.ongoingGameHeader = this.ongoingGameHeader.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStart = this.handleStart.bind(this);
    }

    gameStatus () {
        let elem;
        
        if (this.props.status === "pre") {
            return this.newGameHeader();          
        }

        if (this.props.status === "win" || this.props.status === "lose") {
            elem = this.gameResultHeader();
        }
        else {            
            elem = this.ongoingGameHeader();
        }
        return elem;
    }

    newGameHeader() {
        return (
            <div>
                <h1>
                    Mine Sweeper <img src={mines} className={"Head-pic"}/>
                </h1>                
                {this.startNewGame()}
            </div>  
        );
    }

    gameResultHeader() {
        const picMap ={win, lose}
        return (
            <div>
                <h2>You {this.props.status.toUpperCase()}! 
                <img src={picMap[this.props.status]} className={"Win-pic"} alt={this.props.status}/></h2>
                {this.startNewGame()}
            </div>);
    }

    ongoingGameHeader() {
        const picMap ={width, height, mines}
        let flagsCount = this.props.mines - (this.props.flags.good + this.props.flags.bad);
        return (
            <div>
                <h1>
                    {["Height", "Width", "Mines"].map(curr => {return <span className="Header-title">
                        <img src={picMap[curr.toLowerCase()]} className={"Header-pic"} alt={curr}/> {curr} {this.props[curr.toLowerCase()]}
                    </span>})}
                    <br></br>
                    <span className="Header-title">
                        <img src={flags} className={"Header-pic"} alt="flags"/> Remaining Flags {flagsCount}
                    </span>
                </h1>
            </div>
        );
    }

    startNewGame () {
        let fields = [
            {title:"Board Width:", name:"width"}, 
            {title:"Board Height:", name:"height"},
            {title:"Mines:", name:"mines"}]
        return (<div>
            <h3>Do you want to start a new game?</h3>
            {fields.map((curr)=> (
                <span className="Header-title">{curr.title} <input  type="number" 
                                                                value={this.state[curr.name]}
                                                                name={curr.name}
                                                                onChange={this.handleChange}
                                                                className="Game-input"></input> 
                 </span>
            ))}
            <div onClick={this.handleStart}>
                <h2>
                    Start Game <img src={go} className={"Start-pic"} alt="start game!"/>
                </h2>
            </div>
        </div>);  
    }

    handleStart(event) {
        const newData = {
            height: this.state.height,
            width: this.state.width,
            mines: this.state.mines,
        }
        this.props.update(newData);
    }

    handleChange (event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if (value < 0) value = 0;

        if (name === "width" || name === "height") {
            value = Math.min(value, 300);
        }
        
        if (name === "mines") {
            value = Math.min(value ,this.state.height * this.state.width);
        }

        this.setState({[name]:value});
    }

    render() {
      return this.gameStatus();
    }
  }

export default GameHeader;
